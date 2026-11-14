# 1) Frontend build
FROM node:22-alpine AS web
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json ./
COPY public ./public
COPY src ./src
RUN npm run build

# 2) Server
FROM node:22-alpine
WORKDIR /app/server
ENV NODE_ENV=production PORT=8787 DB_PATH=/data/app.db STATIC_DIR=/app/dist
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/src ./src
COPY server/scripts ./scripts
COPY server/vocab ./vocab
COPY --from=web /web/dist /app/dist
VOLUME /data
EXPOSE 8787
CMD ["node", "--experimental-strip-types", "--no-warnings", "src/index.ts"]
