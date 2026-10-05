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

Registration email alerts use Resend's HTTPS API on Railway Hobby/Free plans,
where outbound SMTP is disabled. Set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`,
and a domain-verified `RESEND_FROM` on the Node API service. Undelivered
registration alerts are retried automatically after the API starts with a
working email provider.

## 1. Prepare the Railway project

1. Open the existing Railway project that contains the `MongoDB` service.
2. Confirm MongoDB is running and its volume is mounted at `/data/db`.
3. Use the GitHub repository `sandeepmasaguppi/advocate_hub`, branch `code`.
4. Reuse the existing `advocate_hub` service for the Node API. If it does not
   exist, create a GitHub service from that repository and branch.
5. Add two more GitHub services from the same repository and branch, named
   `chatbot` and `frontend`.
6. For each GitHub service, open **Settings → Build → Root Directory** and set:
   - Node API: `backend`
   - Chatbot: `chatbot`
   - React website: `frontend/myapp`

7. In each service's **Settings → Config-as-code**, add its absolute config
   file path:
   - Node API: `/backend/railway.json`
   - Chatbot: `/chatbot/railway.json`
   - React website: `/frontend/myapp/railway.json`

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
- `EMAIL_PROVIDER`: `resend` on Railway Hobby/Free plans.
- `RESEND_API_KEY`: a Resend API key, stored as a Railway secret.
- `RESEND_FROM`: an address on a domain verified with Resend, for example
  `Advocates Hub <notifications@your-verified-domain.example>`.
- `ADMIN_NOTIFICATION_EMAIL`: where client and advocate registration alerts
  should be delivered.
- `ADVOCATE_REGISTRATION_EMAIL`: recipient for pending advocate registration
  alerts (set to `advocatehub.in@gmail.com`).
- `ADVOCATE_REGISTRATION_FROM`: sender for advocate registration alerts (set
  to `sandeepmasaguppi@gmail.com` when using that account's SMTP credentials).

Railway Hobby/Free plans block SMTP delivery. On Railway Pro, SMTP is also
supported with `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and
`SMTP_PASS`. Gmail SMTP requires an app password for the same account used as
the sender. An HTTPS email provider can send only from an address verified
with that provider; it may not use the requested Gmail sender address.

Attach a volume to the Node API at `/data` so uploaded avatars persist.
Do not commit `.env` files or paste passwords, hashes, MongoDB URLs, or
credentials into chat.

## 3. Configure the chatbot service

In the `chatbot` **production → Variables**, set:

- `BACKEND_API_URL`:
  `http://${{advocate_hub.RAILWAY_PRIVATE_DOMAIN}}:${{advocate_hub.PORT}}`.
- `PORT`: `8080` (the chatbot container listens on this port; this also makes
  the port available to Railway's service-reference expressions).

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
guarded importer from a trusted environment that can reach MongoDB. Railway's
private MongoDB hostname is not normally reachable from a command running on
your local machine, even when `railway run` supplies service variables. For a
local migration, temporarily enable MongoDB's public TCP proxy and provide its
URI to the importer through a secure environment-variable mechanism (not a
command-line argument); disable the proxy when finished.

The importer imports each local JSON array only into an empty MongoDB
collection and reports collection names and counts, not record contents.
Confirm you have a backup before migration.

## MongoDB collections

The backend stores `advocates`, `clients`, `payments`, `clarity_guide`,
`document_purchases`, and `admin_notifications` in MongoDB. Uploaded avatar
files stay on the Node service's `/data` volume and are served through the
frontend proxy.
