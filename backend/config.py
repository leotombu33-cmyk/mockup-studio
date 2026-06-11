"""Configuration centralisée — tout vient des variables d'environnement."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-image")

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mockup_studio")

# Storage : si STORAGE_BUCKET est défini → S3 / R2 / Supabase (API S3-compatible).
# Sinon → disque local (parfait pour le dev).
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "")
STORAGE_KEY = os.getenv("STORAGE_KEY", "")
STORAGE_SECRET = os.getenv("STORAGE_SECRET", "")
STORAGE_ENDPOINT = os.getenv("STORAGE_ENDPOINT", "")  # ex: https://<id>.r2.cloudflarestorage.com

LOCAL_STORAGE_DIR = Path(os.getenv("LOCAL_STORAGE_DIR", Path(__file__).parent / "storage_data"))

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 Mo
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/webp"}
