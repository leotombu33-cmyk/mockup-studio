"""Appel a Gemini "Nano Banana" (gemini-2.5-flash-image) en image-to-image.

On envoie le design uploade + le prompt de mise en scene, Gemini renvoie
le mockup photorealiste en base64.
"""
import base64

import httpx

import config

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{config.GEMINI_MODEL}:generateContent"
)


class GeminiError(Exception):
    """Levee quand Gemini echoue ou ne renvoie pas d'image."""


def _fail(message: str) -> "GeminiError":
    # Trace visible dans les logs Render pour diagnostiquer facilement.
    print(f"[gemini] ERREUR : {message}", flush=True)
    return GeminiError(message)


async def generate_mockup(image_bytes: bytes, mime_type: str, prompt: str) -> bytes:
    """Compose le design dans la scene demandee. Renvoie les bytes PNG du mockup."""
    if not config.GEMINI_API_KEY:
        raise _fail("GEMINI_API_KEY manquante — renseignez la variable d'environnement")

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
        # Ce modele exige d'accepter TEXT et IMAGE (IMAGE seul -> erreur 400).
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            GEMINI_URL,
            json=payload,
            headers={"x-goog-api-key": config.GEMINI_API_KEY},
        )

    if response.status_code != 200:
        raise _fail(
            f"Gemini a repondu {response.status_code} : {response.text[:500]}"
        )

    body = response.json()
    candidates = body.get("candidates") or []
    if not candidates:
        raise _fail(f"Reponse Gemini sans candidats : {str(body)[:500]}")

    parts = (candidates[0].get("content") or {}).get("parts") or []
    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            return base64.b64decode(inline["data"])

    finish = candidates[0].get("finishReason", "inconnu")
    raise _fail(
        f"Gemini n'a pas renvoye d'image (finishReason={finish}) : {str(parts)[:300]}"
    )
