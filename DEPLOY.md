# Mettre Mockup Studio en ligne — guide pas à pas

Durée totale : 30 à 45 minutes. Tout est gratuit au départ.
Il te faut un ordinateur et ce dossier décompressé.

⚠️ Règle d'or : tes clés (Gemini, MongoDB) ne se collent QUE dans le
dashboard Render, jamais dans le code, jamais sur GitHub, jamais dans un chat.

---

## Étape 1 — Clé Gemini (5 min)

1. Va sur https://aistudio.google.com et connecte-toi avec un compte Google.
2. Menu « Get API key » → « Create API key ».
3. Copie la clé (commence par `AIza...`) et garde-la de côté.

Note : la génération d'images a un quota gratuit limité. Si tu reçois des
erreurs de quota plus tard, il faudra activer la facturation sur le projet
Google Cloud (~0,04 $ par image générée — environ 4 centimes).

## Étape 2 — Base MongoDB Atlas (10 min)

1. Crée un compte sur https://www.mongodb.com/cloud/atlas/register
2. Crée un cluster **M0 (Free)** — choisis une région en Europe (ex: Paris).
3. Dans « Database Access » : crée un utilisateur (note bien le mot de passe).
4. Dans « Network Access » : « Add IP Address » → « Allow access from
   anywhere » (0.0.0.0/0). Obligatoire pour que Render puisse s'y connecter.
5. Bouton « Connect » → « Drivers » → copie la chaîne de connexion :
   `mongodb+srv://utilisateur:<password>@cluster0.xxxxx.mongodb.net/`
6. Remplace `<password>` par ton vrai mot de passe dans la chaîne.

## Étape 3 — GitHub (10 min)

1. Crée un compte sur https://github.com si tu n'en as pas.
2. « New repository » → nom : `mockup-studio` → **Private** → Create.
3. Sur la page du repo : « uploading an existing file ».
4. Glisse-dépose TOUT le contenu du dossier `mockup-studio` décompressé
   (les dossiers backend/, frontend/, le Dockerfile, render.yaml, etc.).
   ⚠️ Ne mets PAS de fichier .env dedans (il n'y en a pas dans le zip, c'est normal).
5. « Commit changes ».

## Étape 4 — Render (10 min)

1. Crée un compte sur https://render.com → « Sign in with GitHub ».
2. « New + » → « Web Service » → sélectionne ton repo `mockup-studio`.
3. Render détecte le Dockerfile automatiquement. Plan : **Free**.
4. Section « Environment Variables », ajoute :
   - `GEMINI_API_KEY` → ta clé de l'étape 1
   - `MONGO_URL`      → ta chaîne de l'étape 2
   - `DB_NAME`        → `mockup_studio`
5. « Create Web Service ». Le premier build prend 5-10 minutes.
6. Quand c'est vert : ton app est en ligne sur
   `https://mockup-studio-XXXX.onrender.com` 🎉

## Bon à savoir

- **Plan gratuit Render** : le serveur s'endort après 15 min d'inactivité.
  La première visite après une pause prend ~50 secondes à charger. Normal.
  (Le plan payant à 7 $/mois supprime ça — pour plus tard, si le MVP valide.)
- **Mises à jour** : modifie le code sur GitHub → Render redéploie tout seul.
- **Stockage** : les images vivent dans MongoDB (GridFS), rien ne se perd
  au redémarrage. Le cluster gratuit fait 512 Mo ≈ largement assez pour
  des centaines de mockups.

## En cas de pépin

- Build qui échoue → onglet « Logs » dans Render, copie l'erreur et
  demande de l'aide avec.
- Erreur 502 à la génération → vérifie `GEMINI_API_KEY` dans Environment.
- Page blanche → vide le cache (Ctrl+Maj+R).
