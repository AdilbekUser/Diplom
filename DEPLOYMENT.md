# Deployment for Diploma Defense

This project is prepared for two free public hosts:

- Frontend: GitHub Pages
- Backend: Render
- Database: MongoDB Atlas

## 1. MongoDB Atlas

The Atlas connection was checked successfully from this workspace before secrets were removed from `.env`.

For Render, add these environment variables:

```text
NODE_ENV=production
JWT_SECRET=<long-random-secret>
MONGODB_URI=<your-mongodb-atlas-uri>
FRONTEND_ORIGIN=https://<github-username>.github.io
```

In Atlas, allow Render to connect. For a diploma demo, the simplest option is adding `0.0.0.0/0` in Network Access. For a stricter setup, add Render outbound IPs if your Render plan exposes them.

## 2. Backend on Render

Use `render.yaml` as a Blueprint, or create a Web Service manually:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

After deploy, check:

```text
https://<render-service>.onrender.com/health
```

Expected result:

```json
{ "status": "ok", "database": "connected" }
```

## 3. Frontend on GitHub Pages

The workflow `.github/workflows/pages.yml` deploys the `frontend` folder without a build step.

In GitHub repository settings:

1. Open `Settings -> Pages`.
2. Set source to `GitHub Actions`.
3. Open `Settings -> Secrets and variables -> Actions -> Variables`.
4. Add repository variable:

```text
API_BASE_URL=https://<render-service>.onrender.com/api
```

Push to `main` or run the workflow manually.

## 4. Local Development

`.env` now contains safe placeholders only. For local backend work, put real values into `.env` on your machine, but do not commit them.

```powershell
npm install
cd backend
npm install
cd ..
npm start
```

The site will still keep localStorage fallback enabled for frontend-only demo flows that are not implemented in the backend yet.
