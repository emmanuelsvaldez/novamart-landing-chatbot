import logging
from typing import List, Dict, Optional
import anyio
from openai import OpenAI
from app.config import NVIDIA_API_KEY, NVIDIA_BASE_URL, NVIDIA_MODEL, is_nim_configured
from app.guardrails import SYSTEM_PROMPT

logger = logging.getLogger("novamart.nim")

def _call_nim_sync(messages: List[Dict[str, str]], system_prompt: str) -> Optional[str]:
    """Llamada síncrona en hilo dedicado para compatibilidad universal con ASGI y event loops."""
    client = OpenAI(
        base_url=NVIDIA_BASE_URL,
        api_key=NVIDIA_API_KEY,
        timeout=15.0
    )
    formatted_messages = [{"role": "system", "content": system_prompt}] + messages
    response = client.chat.completions.create(
        model=NVIDIA_MODEL,
        messages=formatted_messages,
        temperature=0.2,
        max_tokens=256
    )
    reply = response.choices[0].message.content
    return reply.strip() if reply else None

async def call_nim_chat(messages: List[Dict[str, str]], system_prompt: str = SYSTEM_PROMPT) -> Optional[str]:
    """
    Envía la conversación a NVIDIA NIM mediante el SDK oficial de OpenAI.
    Si la API falla o excede el tiempo límite, retorna None para permitir fallback controlado.
    """
    if not is_nim_configured():
        return None

    try:
        reply = await anyio.to_thread.run_sync(_call_nim_sync, messages, system_prompt)
        return reply
    except Exception as exc:
        logger.error(f"Error en llamada a NVIDIA NIM API: {exc}")
        return None
