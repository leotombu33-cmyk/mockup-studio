"""Mockup Studio — backend FastAPI.

Routes :
  GET    /api/scenes               → les 4 scènes disponibles
  POST   /api/mockups/generate     → upload design + scene_id, renvoie le mockup
  GET    /api/mockups?limit=50     → galerie (plus récents d'abord)
  GET    /api/mockups/{id}/image   → bytes PNG du mockup
  DELETE /api/mockups/{id}         → soft delete
"""
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles

import config
import db
from gemini_client import GeminiError, generate_mockup
from scenes import SCENES, SCENES_BY_ID
from storage import storage

app = FastAPI(title="Mockup Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

EXTENSIONS = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp"}


def pdf_to_png(pdf_bytes: bytes) -> bytes:
    """Convertit la première page d'un PDF en PNG haute résolution."""
    import io

    import pypdfium2 as pdfium

    document = pdfium.PdfDocument(pdf_bytes)
    try:
        page = document[0]
        bitmap = page.render(scale=2.0)  # ~150-200 dpi, largement assez pour Gemini
        image = bitmap.to_pil()
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        return buffer.getvalue()
    finally:
        document.close()


def serialize(doc: dict) -> dict:
    return {
        "id": doc["id"],
        "scene_id": doc["scene_id"],
        "scene_title_fr": doc["scene_title_fr"],
        "scene_title_en": doc["scene_title_en"],
        "original_filename": doc["original_filename"],
        "created_at": doc["created_at"],
        "image_url": f"/api/mockups/{doc['id']}/image",
    }


@app.get("/api/scenes")
async def list_scenes():
    return [
        {"id": s["id"], "title_fr": s["title_fr"], "title_en": s["title_en"]}
        for s in SCENES
    ]


@app.post("/api/mockups/generate")
async def generate(file: UploadFile = File(...), scene_id: str = Form(...)):
    scene = SCENES_BY_ID.get(scene_id)
    if scene is None:
        raise HTTPException(status_code=400, detail="invalid_scene")

    if file.content_type not in config.ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="invalid_file_type")

    image_bytes = await file.read()
    if len(image_bytes) > config.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="file_too_large")
    if not image_bytes:
        raise HTTPException(status_code=400, detail="empty_file")

    content_type = file.content_type
    if content_type == "application/pdf":
        try:
            image_bytes = pdf_to_png(image_bytes)
        except Exception as exc:
            raise HTTPException(status_code=400, detail="invalid_pdf") from exc
        content_type = "image/png"

    mockup_id = str(uuid.uuid4())
    extension = EXTENSIONS[content_type]
    design_path = f"designs/{mockup_id}.{extension}"
    mockup_path = f"mockups/{mockup_id}.png"

    await storage.save(design_path, image_bytes)

    try:
        mockup_bytes = await generate_mockup(image_bytes, content_type, scene["prompt"])
    except GeminiError as exc:
        raise HTTPException(status_code=502, detail=f"generation_failed: {exc}") from exc

    await storage.save(mockup_path, mockup_bytes)

    doc = {
        "id": mockup_id,
        "scene_id": scene["id"],
        "scene_title_fr": scene["title_fr"],
        "scene_title_en": scene["title_en"],
        "design_path": design_path,
        "mockup_path": mockup_path,
        "original_filename": file.filename or "design",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_deleted": False,
    }
    await db.mockups().insert_one(dict(doc))

    return serialize(doc)


@app.get("/api/mockups")
async def list_mockups(limit: int = 50):
    limit = max(1, min(limit, 50))
    cursor = db.mockups().find({"is_deleted": False}).sort("created_at", -1).limit(limit)
    return [serialize(doc) async for doc in cursor]


@app.get("/api/mockups/{mockup_id}/image")
async def get_mockup_image(mockup_id: str):
    doc = await db.mockups().find_one({"id": mockup_id, "is_deleted": False})
    if doc is None:
        raise HTTPException(status_code=404, detail="not_found")
    try:
        data = await storage.load(doc["mockup_path"])
    except Exception as exc:  # fichier disparu du storage
        raise HTTPException(status_code=404, detail="image_missing") from exc
    return Response(content=data, media_type="image/png")


@app.delete("/api/mockups/{mockup_id}")
async def delete_mockup(mockup_id: str):
    result = await db.mockups().update_one(
        {"id": mockup_id, "is_deleted": False},
        {"$set": {"is_deleted": True}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="not_found")
    return {"ok": True}


# ─── Frontend (production) ──────────────────────────────────────────────
# En production, le site buildé (Vite) est servi par ce même serveur :
# un seul service à déployer. FRONTEND_DIST pointe vers le dossier dist/.
import os
from pathlib import Path

_frontend = Path(os.getenv("FRONTEND_DIST", Path(__file__).parent.parent / "frontend" / "dist"))
if _frontend.is_dir():
    app.mount("/", StaticFiles(directory=_frontend, html=True), name="frontend")
