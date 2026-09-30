import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import PORT, HOST, NVIDIA_MODEL, is_nim_configured
from app.database import get_all_orders, reset_orders_db
from app.tools import consultar_pedido, rastrear_pedido, validar_cancelacion, ejecutar_cancelacion
from app.guardrails import (
    is_off_topic,
    extract_order_id,
    is_order_action_query,
    check_pending_cancellation_confirmation,
    OFF_TOPIC_RESPONSE,
    MISSING_ORDER_ID_RESPONSE,
    SYSTEM_PROMPT
)
from app.nim_service import call_nim_chat

# Configurar logs
logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s")
logger = logging.getLogger("novamart.api")

app = FastAPI(
    title="NovaMart Enterprise BFF API",
    description="Backend for Frontend para Landing Page y Chatbot con NVIDIA NIM (Bootcamp SKALA - Semana 3)",
    version="1.0.0"
)

# Configuración de CORS para permitir la conexión desde el frontend en localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para los contratos de API
class ChatMessage(BaseModel):
    role: str = Field(..., description="Rol del emisor: 'user' o 'assistant'")
    content: str = Field(..., description="Contenido textual del mensaje")

class ChatRequest(BaseModel):
    message: str = Field(..., description="Mensaje actual del usuario")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Historial previo de la conversación")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Respuesta del chatbot para mostrar al usuario")
    tool_called: Optional[str] = Field(None, description="Nombre de la herramienta o filtro ejecutado")
    order_updated: Optional[Dict[str, Any]] = Field(None, description="Datos del pedido si fue modificado (para reactividad)")
    inference_source: str = Field("local_guardrails", description="Origen de la respuesta: 'nvidia_nim' o 'local_guardrails'")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "NovaMart Enterprise Chatbot API",
        "nim_configured": is_nim_configured(),
        "model": NVIDIA_MODEL,
        "endpoints": {
            "orders": "/api/orders",
            "chat": "/api/chat",
            "docs": "/docs"
        }
    }

@app.get("/api/orders")
def get_orders():
    """Retorna los pedidos simulados de NovaMart para pintar la tabla reactiva."""
    return get_all_orders()

@app.post("/api/orders/reset")
def reset_orders():
    """Reinicia la base de datos simulada para repetir las pruebas de la rúbrica."""
    orders = reset_orders_db()
    return {"message": "Base de datos de pedidos reiniciada exitosamente", "orders": orders}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """
    Endpoint principal del Chatbot con filtro anti-desvío estricto,
    ejecución determinista de herramientas y conexión a NVIDIA NIM.
    """
    user_msg = payload.message.strip()
    history_dicts = [{"role": m.role, "content": m.content} for m in payload.history]

    logger.info(f"Mensaje recibido: '{user_msg}' | Historial: {len(history_dicts)} mensajes")

    # 1. FILTRO ANTI-DESVÍO ESTRICTO (Rúbrica: 10 pts)
    # Rechaza inmediatamente temas ajenos como recetas, pizzas, poemas, política, etc.
    if is_off_topic(user_msg):
        logger.info("Activado filtro anti-desvío por tema no permitido.")
        return ChatResponse(
            reply=OFF_TOPIC_RESPONSE,
            tool_called="filtro_antidesvio",
            order_updated=None,
            inference_source="guardrails_filter"
        )

    # 2. VALIDACIÓN DE CONFIRMACIÓN DE CANCELACIÓN EN DOS PASOS (Rúbrica: 15 pts)
    is_confirm, order_id_confirm = check_pending_cancellation_confirmation(user_msg, history_dicts)
    if order_id_confirm:
        if is_confirm:
            success, cancel_msg, updated_order = ejecutar_cancelacion(order_id_confirm)
            logger.info(f"Cancelación confirmada para {order_id_confirm}: {success}")
            return ChatResponse(
                reply=cancel_msg,
                tool_called="cancelar_pedido",
                order_updated=updated_order,
                inference_source="system_execution"
            )
        else:
            return ChatResponse(
                reply=f"Operación cancelada. Tu pedido {order_id_confirm} permanece con su estado actual.",
                tool_called="cancelar_abortado",
                order_updated=None,
                inference_source="system_execution"
            )

    # 3. DETECCIÓN Y EXTRACCIÓN DE IDENTIFICADOR DE PEDIDO (ORD-####)
    order_id = extract_order_id(user_msg)

    # Si el usuario hace una consulta sobre pedidos pero no proporciona ID (Rúbrica: 10 pts)
    if not order_id and is_order_action_query(user_msg):
        return ChatResponse(
            reply=MISSING_ORDER_ID_RESPONSE,
            tool_called="detector_dato_faltante",
            order_updated=None,
            inference_source="guardrails_filter"
        )

    # Si es saludo cordial o mensaje inicial sin ID
    if not order_id:
        lower_msg = user_msg.lower()
        if any(g in lower_msg for g in ["hola", "buenas", "buen día", "buenos días", "buenas tardes", "buenas noches", "ayuda"]):
            welcome_msg = (
                "¡Hola! Bienvenido al centro de atención de pedidos de NovaMart. "
                "Puedo ayudarte a consultar el estatus, rastrear o validar la cancelación de tu orden. "
                "Por favor proporcióname tu número de pedido con formato ORD-#### (ejemplo: ORD-1001)."
            )
            return ChatResponse(
                reply=welcome_msg,
                tool_called=None,
                order_updated=None,
                inference_source="welcome_agent"
            )
        else:
            # Mensaje no reconocido que no coincide con pedidos
            return ChatResponse(
                reply=OFF_TOPIC_RESPONSE,
                tool_called="filtro_antidesvio",
                order_updated=None,
                inference_source="guardrails_filter"
            )

    # 4. CLASIFICACIÓN DE INTENCIÓN Y EJECUCIÓN DE TOOLS DETERMINISTAS
    lower_msg = user_msg.lower()
    tool_called_name = "consultar_pedido"
    tool_result_text = ""
    order_data = None

    if any(k in lower_msg for k in ["cancel", "anular", "eliminar", "parar"]):
        tool_called_name = "validar_cancelacion"
        _, _, tool_result_text, order_data = validar_cancelacion(order_id)
    elif any(k in lower_msg for k in ["dónde", "donde", "rastre", "ubicaci", "ruta", "camino"]):
        tool_called_name = "rastrear_pedido"
        _, tool_result_text, order_data = rastrear_pedido(order_id)
    else:
        tool_called_name = "consultar_pedido"
        _, tool_result_text, order_data = consultar_pedido(order_id)

    # 5. SÍNTESIS CON NVIDIA NIM O RESPUESTA DIRECTA
    final_reply = tool_result_text
    inference_source = "local_tool"

    if is_nim_configured():
        # Enviar contexto estructurado a NVIDIA NIM
        prompt_with_data = (
            f"{SYSTEM_PROMPT}\n\n"
            f"INFORMACIÓN OFICIAL DEL SISTEMA LOGÍSTICO NOVAMART:\n"
            f"- Herramienta ejecutada: {tool_called_name}\n"
            f"- Datos confirmados: {tool_result_text}\n\n"
            f"Instrucción: Transmite esta información al usuario respetando estrictamente los datos verificados "
            f"sin alterar ningún estatus, ubicación ni regla de cancelación."
        )
        nim_history = history_dicts + [{"role": "user", "content": user_msg}]
        nim_reply = await call_nim_chat(messages=nim_history, system_prompt=prompt_with_data)
        if nim_reply:
            final_reply = nim_reply
            inference_source = "nvidia_nim"
            logger.info(f"Respuesta generada con NVIDIA NIM ({NVIDIA_MODEL})")

    return ChatResponse(
        reply=final_reply,
        tool_called=tool_called_name,
        order_updated=None,
        inference_source=inference_source
    )
