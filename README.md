# KDAG_WEB

KDAG_WEB is a Vite + React frontend with a FastAPI backend that stores posts in MongoDB. This repository contains a modern blog-like UI (client) and a minimal backend API used for posts storage and retrieval.

## Features

- Fast, Vite-powered React frontend
- FastAPI backend with async MongoDB driver (Motor)
- Ready for deployment to Vercel (frontend) or any Python hosting for backend
- TailwindCSS utility styling and client-side routing

## Tech stack

- Frontend: React (Vite), TailwindCSS, Axios
- Backend: FastAPI, Motor (async MongoDB driver)
- DB: MongoDB (remote or local)

## Prerequisites

- Node.js (>=18) and npm or yarn
- Python 3.11+ and pip
- MongoDB instance (local or cloud Atlas)

## Quick setup (local)

1. Clone the repo

   git clone <repository-url>
   cd KDAG_WEB

2. Frontend (client)

   - Install dependencies

     npm install

   - Start dev server

     npm run dev

   The frontend dev server runs at http://localhost:5173 by default.

3. Backend (API)

   - Create and activate a virtual environment

     python -m venv .venv
     .venv\Scripts\activate    # Windows
     source .venv/bin/activate  # macOS / Linux

   - Install Python dependencies

     pip install -r backend/requirements.txt

   - Create a `.env` file in the project root or provide environment variables. Example `.env`:

     MONGODB_URI=mongodb://localhost:27017
     MONGODB_DB=kdag_db

   - Run the API server (development)

     uvicorn backend.main:app --reload --port 8000

   The API will be available at http://localhost:8000.

4. Configure the frontend to talk to the backend

   - By default the frontend expects the API at `/posts`. If you run the backend on `localhost:8000`, ensure any client env or axios base URL points at `http://localhost:8000`.

## Environment variables

- `MONGODB_URI` — MongoDB connection string (default: `mongodb://localhost:27017`)
- `MONGODB_DB` — database name (default: `kdag_db`)

Place any environment variables in a `.env` file at the repository root, or configure them in your deployment provider.

## API Endpoints

- `GET /posts` — returns all posts
- `GET /posts/{post_id}` — returns a post by `id`
- `POST /posts` — create a new post (JSON body must include an `id` field)

Note: The backend converts Mongo ObjectId to string when returning records and expects unique `id` values in documents.

## Build for production

1. Build the frontend

   npm run build

   The production-ready static files are emitted to `dist/`.

2. Preview production build locally

   npm run preview

## Deployment

Frontend (recommended): Vercel

- This project already contains `vercel.json` configured to serve the static `dist` output.
- Steps:
  1. Push your repo to GitHub.
  2. Create a new project on Vercel and import the GitHub repo.
  3. Set the build command to `npm run build` and output directory to `dist` (Vercel auto-detects this for Vite projects).
  4. Add environment variables (`MONGODB_URI`, `MONGODB_DB`) if your frontend needs any server-side envs.

Backend

- The backend is a FastAPI application and must be deployed to a Python-supporting host (Heroku, Railway, Fly, DigitalOcean App Platform, AWS, Azure). Configure your provider to run:

  ```
  uvicorn backend.main:app --host 0.0.0.0 --port $PORT
  ```

- Ensure `MONGODB_URI` is set in the deployment environment and accessible from the host.

Full stack deployment note

- If you deploy frontend to Vercel and backend to another host, update the frontend axios base URL or set a runtime env so the client can reach the API domain.

Alternative: GitHub Pages (frontend-only)

- You can host the built `dist/` on GitHub Pages or any static hosting provider. Use `npm run build` and push `dist/` contents to the `gh-pages` branch or configure GitHub Actions to publish `dist/` automatically.

## Contributing

- Bug reports and PRs are welcome. Please open an issue describing the problem before submitting larger changes.

## License

This project does not include a license file. Add one if you plan to make this repository public with an explicit license.

## Contact

If you need help setting up deployment (Vercel, a hosted FastAPI instance, or CI/CD), open an issue or contact the project maintainer.
