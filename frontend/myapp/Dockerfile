FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/build ./build
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
