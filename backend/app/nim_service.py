import logging
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from app.config import NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_MODEL, is_nim_configured
from app.guardrails import SYSTEM_PROMPT

logger = logging.getLogger("novamart.nim")

client: Optional[AsyncOpenAI] = None

if is_nim_configured():
    try:
        client = AsyncOpenAI(
            base_url=NVIDIA_BASE_URL,
            api_key=NVIDIA_API_KEY
        )
        logger.info(f"NVIDIA NIM Client inicializado correctamente con modelo {NVIDIA_MODEL}.")
    except Exception as e:
        logger.error(f"Error al inicializar cliente NVIDIA NIM: {e}")
        client = None
else:
    logger.warning("NVIDIA_API_KEY no configurada o es placeholder. Se activará el motor de inferencia local con guardrails.")

async def call_nim_chat(messages: List[Dict[str, str]], system_prompt: str = SYSTEM_PROMPT) -> Optional[str]:
    """
    Envía la conversación a NVIDIA NIM mediante el SDK oficial de OpenAI.
    Si la API falla o la llave no está configurada, retorna None para permitir fallback controlado.
    """
    global client
    # Reintentar inicialización si la llave cambió en tiempo de ejecución
    if client is None and is_nim_configured():
        client = AsyncOpenAI(
            base_url=NVIDIA_BASE_URL,
            api_key=NVIDIA_API_KEY
        )

    if client is None:
        return None

    formatted_messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        response = await client.chat.completions.create(
            model=NVIDIA_MODEL,
            messages=formatted_messages,
            temperature=0.2,
            max_tokens=256
        )
        reply = response.choices[0].message.content
        if reply:
            return reply.strip()
    except Exception as exc:
        logger.error(f"Error en llamada a NVIDIA NIM API: {exc}")
        return None

    return None
