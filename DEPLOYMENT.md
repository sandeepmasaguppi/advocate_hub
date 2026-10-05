# Railway deployment

The repository is configured as one Railway web service: the Node API serves
the React production build, and a Railway volume stores app data and uploads.

## Setup

1. Push this repository to a private GitHub repository and connect it to Railway.
2. Deploy the repository root, using the included `Dockerfile`.
3. Add a Railway volume mounted at `/data` before the first deployment. The
   container seeds initial advocate and guide content there; new client,
   payment, purchase, notification, and upload files are kept on the volume.
4. Add these service variables in Railway:
   - `AUTH_SECRET`: generate a random 32-byte secret locally with
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `ADMIN_EMAIL`: the admin account email you want to use.
   - `ADMIN_PASSWORD_HASH`: generate with
     `node backend/hash-password.js "your-new-admin-password"`.
   - `APP_DATA_DIR`: `/data` (also set as the container default).
   - `NODE_ENV`: `production` (also set as the container default).
5. Optionally configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
   `SMTP_PASS`, `SMTP_FROM`, `SMTP_REPLY_TO`, and `ADMIN_NOTIFICATION_EMAIL`
   as Railway variables to enable email notifications. Do not commit or share
   these values.
6. Generate a Railway domain for the service. The app and its `/api` endpoints
   use the same domain; Railway's `/api/health` health check should return
   `{"ok":true}`.

Do not put passwords, hashes, signing secrets, SMTP credentials, or a local
`.env` file in Git or in this document. The Docker build deliberately excludes
local client, payment, purchase, and notification records.
