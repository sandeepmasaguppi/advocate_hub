# Deploy Advocates Hub to Railway

This repository contains three application folders and a MongoDB database:

| Railway service | Repository root directory | Purpose |
| --- | --- | --- |
| `advocate_hub` | `backend` | Node.js API, MongoDB persistence, and chatbot proxy |
| `chatbot` | `chatbot` | Python FastAPI chatbot |
| `frontend` | `frontend/myapp` | React production website and same-origin API proxy |
| `MongoDB` | Railway MongoDB image | Persistent application database |

The chatbot is **FastAPI**, not Flask: `chatbot/main.py` creates a FastAPI app.
The frontend routes `/api` and `/uploads` through its Node static server to the
backend; the backend forwards `/api/chat` to FastAPI. MongoDB is the source of
truth for backend records. A Railway volume is used only for uploaded avatar
files, and MongoDB has its own persistent volume.

## 1. Prepare the Railway project

1. Open the existing Railway project that contains the `MongoDB` service.
2. Confirm MongoDB is running and its volume is mounted at `/data/db`.
3. Use the existing GitHub repository `sandeepmasaguppi/che`, branch `code`.
4. Reuse the existing `advocate_hub` service for the Node API. If it does not
   exist, create a GitHub service from that repository and branch.
5. Add two more GitHub services from the same repository and branch, named
   `chatbot` and `frontend`.
6. For each GitHub service, open **Settings → Build → Root Directory** and set:
   - Node API: `backend`
   - Chatbot: `chatbot`
   - React website: `frontend/myapp`

   Each folder contains its own `Dockerfile` and `railway.json`. Let its
   Dockerfile provide the build and start commands.

## 2. Configure the Node API service

In the `advocate_hub` **production → Variables**, set or confirm:

- `AUTH_SECRET`: a fresh random secret (generate locally with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
- `ADMIN_EMAIL`: the administrator's login email.
- `ADMIN_PASSWORD_HASH`: a hash generated locally with
  `node backend/hash-password.js "your-new-password"`.
- `MONGODB_URI`: Railway reference `${{MongoDB.MONGO_URL}}`.
- `MONGODB_DB_NAME`: `advocates_hub`.
- `CHATBOT_URL`: Railway private-service reference
  `http://${{chatbot.RAILWAY_PRIVATE_DOMAIN}}:${{chatbot.PORT}}`.
- `FRONTEND_URL`: the generated Railway domain for the React service
  (add it after generating that domain).
- `APP_UPLOAD_DIR`: `/data/uploads`.
- `NODE_ENV`: `production`.

Attach a volume to the Node API at `/data` so uploaded avatars persist.
Do not commit `.env` files or paste passwords, hashes, MongoDB URLs, or
credentials into chat.

## 3. Configure the chatbot service

In the `chatbot` **production → Variables**, set:

- `BACKEND_API_URL`:
  `http://${{advocate_hub.RAILWAY_PRIVATE_DOMAIN}}:${{advocate_hub.PORT}}`.

The chatbot reads current approved advocates and the clarity guide from the
Node API, which reads those records from MongoDB. It does not need its own
MongoDB password or a public domain.

## 4. Configure the React service

In the `frontend` **production → Variables**, set:

- `BACKEND_API_URL`:
  `http://${{advocate_hub.RAILWAY_PRIVATE_DOMAIN}}:${{advocate_hub.PORT}}`.

The frontend's Node server proxies API and avatar requests to the backend so
the browser uses one website origin and does not require a React rebuild to
change the API URL.

## 5. Deploy in order

Deploy the `advocate_hub` API first, then the `chatbot`, then the `frontend`.
The Railway health checks are `/api/health`, `/health`, and `/`, respectively.
Generate a public domain for the `frontend` service. The frontend domain is the
public website URL; the backend and chatbot can remain private services.

Check the Node API logs for successful MongoDB collection initialization and
the chatbot logs for successful `/api` access. Test the website, login, avatar
loading, and chatbot after all three services are healthy.

## 6. Import existing private JSON records (optional)

On first startup, the Node service seeds MongoDB collections from JSON files
included in the repository, but only when the corresponding collections are
empty. The private `backend/data/clients.json` is intentionally excluded from
Git and Docker so client records are never uploaded as part of a build.

If you need to migrate that local file or other local-only records, run the
guarded importer from the repository root using the Node API service's Railway
environment:

```powershell
railway run --project <project-id> --environment production --service advocate_hub -- node backend/import-json-to-mongo.js
```

It imports each local JSON array only into an empty MongoDB collection and
reports collection names and counts, not record contents. Confirm you have a
backup before migration. Do not set `MONGODB_URI` manually on the command line;
Railway supplies it to the command through the service environment.

## MongoDB collections

The backend stores `advocates`, `clients`, `payments`, `clarity_guide`,
`document_purchases`, and `admin_notifications` in MongoDB. Uploaded avatar
files stay on the Node service's `/data` volume and are served through the
frontend proxy.
