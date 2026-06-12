"""Connexion MongoDB asynchrone (motor).

La connexion est creee paresseusement, a la premiere requete : la creer
au demarrage du module la lierait au mauvais event loop sous uvicorn
(erreur "attached to a different loop").
"""
from motor.motor_asyncio import AsyncIOMotorClient

import config

_client = None


def client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(config.MONGO_URL)
    return _client


def database():
    return client()[config.DB_NAME]


def mockups():
    return database()["mockups"]
