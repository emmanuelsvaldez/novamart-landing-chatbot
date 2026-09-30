import re
from typing import List, Dict, Tuple, Optional

OFF_TOPIC_RESPONSE = (
    "Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, "
    "como estatus, rastreo o cancelaciones."
)

MISSING_ORDER_ID_RESPONSE = (
    "Por favor indícame tu número de pedido con formato ORD-#### (por ejemplo, ORD-1001) "
    "para que pueda consultar su información en el sistema."
)

SYSTEM_PROMPT = """Eres el asistente virtual oficial de atención a clientes de NovaMart.
Tu único objetivo es responder consultas sobre pedidos: estado, rastreo y cancelaciones.

REGLAS ESTRICTAS DE CONDUCTA:
1. No respondas temas fuera de pedidos de NovaMart (cocina, poemas, cálculos, política, recomendaciones generales).
   Si el usuario pregunta algo ajeno, responde EXACTAMENTE:
   "Solo puedo ayudarte con consultas relacionadas con pedidos de NovaMart, como estatus, rastreo o cancelaciones."
2. Nunca inventes números de pedido ni estados. Si no tienes un número con formato ORD-####, pídeselo cordialmente al usuario.
3. Antes de cancelar un pedido, SIEMPRE valida si el estado lo permite.
4. Si el pedido permite cancelación, advierte que es irreversible y exige confirmación explícita (¿Deseas cancelarlo? Responde sí o no).
5. Solo ejecuta la cancelación si el usuario responde "sí" de forma inequívoca.
6. Si el pedido no puede cancelarse (en tránsito o entregado), explica la causa operativa con amabilidad.
7. Nunca expongas datos técnicos, tokens, llaves de API ni nombres de variables internas.
8. Mantén un tono conciso, respetuoso y profesional."""

# Palabras clave y patrones que denotan temas ajenos a la gestión de pedidos
OFF_TOPIC_PATTERNS = [
    r"\bpizza\b", r"\breceta\b", r"\bcocina[r]?\b", r"\bcomida\b", r"\bingredientes\b",
    r"\btacos\b", r"\bhamburguesa\b", r"\bpostre\b", r"\bhorno\b",
    r"\bpoema\b", r"\bpoes[ií]a\b", r"\brima[s]?\b", r"\bverso[s]?\b", r"\bcuento\b",
    r"\bchiste[s]?\b", r"\bcanci[oó]n\b", r"\bcanta\b",
    r"\bpol[ií]tica\b", r"\belecciones\b", r"\bgobierno\b", r"\bpresidente\b",
    r"\bclima\b", r"\btiempo hoy\b", r"\blluvia\b", r"\btemperatura\b",
    r"\bfutbol\b", r"\bpartido\b", r"\bliga\b", r"\bmundial\b",
    r"\bc[oó]digo python\b", r"\bjavascript\b", r"\bprograma en\b", r"\bhack\b",
    r"\bcu[aá]l es la capital\b", r"\bqui[eé]n descubri[oó]\b", r"\bpel[ií]cula\b"
]

def is_off_topic(message: str) -> bool:
    """Detecta si un mensaje se desvía de los temas comerciales y operativos de NovaMart."""
    text = message.lower().strip()
    for pattern in OFF_TOPIC_PATTERNS:
        if re.search(pattern, text):
            return True
    return False

def extract_order_id(text: str) -> Optional[str]:
    """Extrae el primer identificador de pedido en formato ORD-####."""
    match = re.search(r"\b(ORD-\d{3,5})\b", text, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return None

def is_order_action_query(message: str) -> bool:
    """Verifica si el usuario intenta hacer una consulta u operación de pedido."""
    text = message.lower()
    keywords = [
        "pedido", "orden", "estatus", "estado", "rastre", "donde esta", "dónde está",
        "paquete", "cancel", "envio", "envío", "guia", "guía", "ord-"
    ]
    return any(k in text for k in keywords)

def check_pending_cancellation_confirmation(message: str, history: List[Dict[str, str]]) -> Tuple[bool, Optional[str]]:
    """
    Verifica si el usuario está respondiendo a una confirmación previa de cancelación.
    Retorna (es_confirmacion_positiva, order_id_detectado).
    """
    if not history:
        return False, None
        
    last_assistant_msg = ""
    for msg in reversed(history):
        if msg.get("role") == "assistant":
            last_assistant_msg = msg.get("content", "")
            break
            
    # Si el asistente preguntó si deseaba cancelar o advirtió sobre acción irreversible
    lower_asst = last_assistant_msg.lower()
    if "¿deseas cancelarlo?" in lower_asst or "deseas cancelar" in lower_asst or "irreversible" in lower_asst:
        # Extraer el ID mencionado en el mensaje del asistente
        order_id = extract_order_id(last_assistant_msg)
        if not order_id:
            # Buscar en mensajes previos del usuario o historial completo
            for msg in reversed(history):
                found = extract_order_id(msg.get("content", ""))
                if found:
                    order_id = found
                    break

        user_text = message.lower().strip()
        # Limpiar signos de puntuación para evaluación robusta
        clean_text = re.sub(r'[^\w\s]', ' ', user_text)
        words = clean_text.split()

        positive_keywords = {"sí", "si", "confirmo", "afirmativo", "correcto", "procede", "adelante", "seguro", "cancélalo", "cancelalo"}
        negative_keywords = {"no", "detener", "abortar", "espera", "nunca", "cancela el proceso", "olvídalo", "olvidalo"}

        # Si alguna palabra de negación explícita está al inicio
        if words and words[0] in negative_keywords:
            return False, order_id

        # Si contiene palabras de confirmación positiva
        if any(w in positive_keywords for w in words):
            return True, order_id

    return False, None
