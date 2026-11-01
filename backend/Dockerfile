FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY server.js dataStore.js emailService.js cloudflareService.js migrate-images-to-r2.js *.js ./
COPY data/ ./data/
COPY uploads/ ./uploads/

EXPOSE 5000
CMD ["node", "server.js"]
