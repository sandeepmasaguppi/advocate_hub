FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js dataStore.js emailService.js ./
COPY data/ ./data/
COPY uploads/ ./uploads/

EXPOSE 5000
CMD ["node", "server.js"]
