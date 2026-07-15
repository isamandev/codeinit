# Development Environment Only
# This Dockerfile is configured for local development with Turbopack hot-reload
# Not suitable for production use

FROM node:26-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy frontend package files
COPY frontend/package*.json ./frontend/

# Install dependencies
# Using --legacy-peer-deps because @typescript-eslint v8 doesn't officially support TS 7 yet
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend ./frontend

WORKDIR /app/frontend

EXPOSE 3000

# Start with npm run dev for hot-reload and Turbopack during development
CMD ["npm", "run", "dev"]
