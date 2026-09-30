import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar .env desde la raíz del backend
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-ultra-550b-a55b")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

def is_nim_configured() -> bool:
    """Verifica si la llave de NVIDIA NIM es real y no el placeholder."""
    return bool(NVIDIA_API_KEY and not NVIDIA_API_KEY.startswith("nvapi-your-key") and len(NVIDIA_API_KEY) > 10)
