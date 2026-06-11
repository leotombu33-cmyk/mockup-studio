# ─── Étape 1 : build du frontend ─────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# ─── Étape 2 : backend Python + site buildé ──────────────────
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
COPY --from=frontend /build/dist ./static
ENV FRONTEND_DIST=/app/static
EXPOSE 8000
CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
