# Stage 1: Build
FROM node:18-buster AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package.json package-lock.json ./

# Copy all source files after installing dependencies
COPY . .

# Install all dependencies including devDependencies for build

RUN npm install



# Run the icon build step (make sure the path exists)
# RUN npm run build:icons

# Run Next.js production build
RUN npm run build


# Stage 2: Production
FROM node:20-bullseye

WORKDIR /app

# Copy package files to install production dependencies only
COPY package.json package-lock.json ./

RUN npm install --omit=dev

# Copy built assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose the default Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
