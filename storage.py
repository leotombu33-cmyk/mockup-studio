"""Stockage des images.

Trois modes, choisis automatiquement :
  - S3 / R2 / Supabase  -> si STORAGE_BUCKET est defini
  - Disque local        -> si STORAGE_MODE=local (dev uniquement)
  - MongoDB GridFS      -> par defaut (zero service en plus, parfait pour le MVP)

GridFS stocke les images dans la meme base MongoDB que les metadonnees :
un seul service a configurer, et rien ne se perd quand le serveur redemarre
(contrairement au disque des hebergeurs gratuits, qui est ephemere).
"""
from __future__ import annotations

import asyncio
import os

import config


class MongoStorage:
    """Images dans MongoDB via GridFS — le defaut, et le plus simple."""

    def __init__(self):
        self._bucket = None  # cree a la premiere utilisation (bon event loop)

    @property
    def bucket(self):
        if self._bucket is None:
            from motor.motor_asyncio import AsyncIOMotorGridFSBucket

            import db

            self._bucket = AsyncIOMotorGridFSBucket(db.database())
        return self._bucket

    async def save(self, path: str, data: bytes) -> None:
        await self.bucket.upload_from_stream(path, data)

    async def load(self, path: str) -> bytes:
        stream = await self.bucket.open_download_stream_by_name(path)
        return await stream.read()


class LocalStorage:
    """Stockage sur disque — uniquement pour le developpement local."""

    def __init__(self):
        self.root = config.LOCAL_STORAGE_DIR
        self.root.mkdir(parents=True, exist_ok=True)

    async def save(self, path: str, data: bytes) -> None:
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)

    async def load(self, path: str) -> bytes:
        return (self.root / path).read_bytes()


class S3Storage:
    """Stockage S3-compatible (AWS S3, Cloudflare R2, Supabase Storage)."""

    def __init__(self):
        import boto3  # import paresseux : inutile dans les autres modes

        kwargs = {
            "aws_access_key_id": config.STORAGE_KEY,
            "aws_secret_access_key": config.STORAGE_SECRET,
        }
        if config.STORAGE_ENDPOINT:
            kwargs["endpoint_url"] = config.STORAGE_ENDPOINT
        self.client = boto3.client("s3", **kwargs)
        self.bucket = config.STORAGE_BUCKET

    async def save(self, path: str, data: bytes) -> None:
        await asyncio.to_thread(
            self.client.put_object, Bucket=self.bucket, Key=path, Body=data
        )

    async def load(self, path: str) -> bytes:
        response = await asyncio.to_thread(
            self.client.get_object, Bucket=self.bucket, Key=path
        )
        return response["Body"].read()


def get_storage():
    if config.STORAGE_BUCKET:
        return S3Storage()
    if os.getenv("STORAGE_MODE", "").lower() == "local":
        return LocalStorage()
    return MongoStorage()


storage = get_storage()
