# Mockup Studio

Studio de mockups IA pour vendeurs Etsy. Uploadez un design imprimable (carte,
étiquette, faire-part), choisissez une scène, et Gemini "Nano Banana" le met en
scène dans une photo professionnelle prête à publier.

## Stack

- **Frontend** : React (Vite) + Tailwind CSS + Framer Motion + lucide-react + sonner + axios
- **Backend** : FastAPI + MongoDB (motor)
- **IA image** : Google Gemini `gemini-2.5-flash-image` (image-to-image)
- **Storage** : disque local par défaut, S3 / Cloudflare R2 / Supabase si configuré

## Prérequis

- Python 3.10+
- Node.js 18+ et yarn (ou npm)
- MongoDB local (`mongod`) ou un cluster Atlas gratuit
- Une clé API Gemini ([aistudio.google.com](https://aistudio.google.com))

## Installation

### 1. Variables d'environnement

```bash
cp .env.example backend/.env
# puis éditez backend/.env : GEMINI_API_KEY au minimum
```

Laisser les variables `STORAGE_*` vides = stockage sur disque local dans
`backend/storage_data/` (recommandé en dev). Pour R2/S3/Supabase, renseignez
`STORAGE_BUCKET`, `STORAGE_KEY`, `STORAGE_SECRET` et `STORAGE_ENDPOINT`.

### 2. Backend

```bash
cd backend  # voir aussi DEPLOY.md pour la mise en ligne
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
yarn                            # ou : npm install
yarn dev                        # ou : npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000) — le proxy Vite
redirige `/api` vers le backend (port 8000).

## API

| Méthode | Route                      | Description                          |
| ------- | -------------------------- | ------------------------------------ |
| GET     | `/api/scenes`              | Les 4 scènes disponibles             |
| POST    | `/api/mockups/generate`    | multipart : `file` + `scene_id`      |
| GET     | `/api/mockups?limit=50`    | Galerie, plus récents d'abord        |
| GET     | `/api/mockups/{id}/image`  | Bytes PNG du mockup                  |
| DELETE  | `/api/mockups/{id}`        | Soft delete                          |

## Notes

- Formats acceptés : PNG, JPG, WEBP — 25 Mo max.
- Gemini 2.5 Flash Image produit nativement du ~1024 px ; pour du 2048 px
  garanti, ajoutez un upscaler (Real-ESRGAN ou l'API d'upscale de votre choix)
  dans `gemini_client.py` après la génération.
- Tous les éléments interactifs portent un `data-testid` pour les tests E2E.
- La langue (FR/EN) est persistée dans `localStorage`.
