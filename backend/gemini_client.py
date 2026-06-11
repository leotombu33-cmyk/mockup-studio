"""Appel à Gemini "Nano Banana" (gemini-2.5-flash-image) en image-to-image.

On envoie le design uploadé + le prompt de mise en scène, Gemini renvoie
le mockup photoréaliste en base64.
"""
import base64

import httpx

import config

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{config.GEMINI_MODEL}:generateContent"
)


class GeminiError(Exception):
    """Levée quand Gemini échoue ou ne renvoie pas d'image."""


async def generate_mockup(image_bytes: bytes, mime_type: str, prompt: str) -> bytes:
    """Compose le design dans la scène demandée. Renvoie les bytes PNG du mockup."""
    if not config.GEMINI_API_KEY:
        raise GeminiError("GEMINI_API_KEY manquante — renseignez le fichier .env")

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64.b64encode(image_bytes).decode(),
                        }
                    },
                    {"text": prompt},
                ]
            }
        ],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            GEMINI_URL,
            json=payload,
            headers={"x-goog-api-key": config.GEMINI_API_KEY},
        )

    if response.status_code != 200:
        raise GeminiError(f"Gemini a répondu {response.status_code} : {response.text[:300]}")

    try:
        parts = response.json()["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError) as exc:
        raise GeminiError("Réponse Gemini inattendue (pas de candidats)") from exc

    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            return base64.b64decode(inline["data"])

    raise GeminiError("Gemini n'a pas renvoyé d'image pour cette requête")
