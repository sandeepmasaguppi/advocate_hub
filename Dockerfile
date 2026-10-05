FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend/myapp
COPY frontend/myapp/package.json frontend/myapp/package-lock.json ./
RUN npm ci
COPY frontend/myapp/ ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV APP_DATA_DIR=/data

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --omit=dev --prefix backend
COPY backend/server.js backend/emailService.js ./backend/
COPY backend/data/advocates.json backend/data/clarityguide.json ./backend/data/
COPY backend/uploads/ ./backend/uploads/
COPY --from=frontend-build /app/frontend/myapp/build ./frontend/myapp/build

EXPOSE 5000
CMD ["node", "backend/server.js"]
