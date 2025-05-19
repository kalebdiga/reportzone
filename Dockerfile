# Stage 1: Build
FROM node:18-bullseye AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Optional: disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Stage 2: Production
FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npx", "next", "start"]
