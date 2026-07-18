# Development Environment Only
# This Dockerfile is configured for local development with hot-reload
# Not suitable for production use

FROM node:26-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy backend package files
COPY backend/package*.json ./backend/

# Install dependencies
# Using --legacy-peer-deps because @typescript-eslint v8 doesn't officially support TS 7 yet
RUN npm install --legacy-peer-deps

# Copy backend source and Prisma schema
COPY backend/src ./backend/src
COPY backend/scripts ./backend/scripts
COPY backend/tsconfig.json ./backend/
COPY backend/prisma.config.ts ./backend/
COPY backend/eslint.config.js ./backend/
COPY backend/prisma ./backend/prisma

# Generate Prisma client
# Set a dummy DATABASE_URL for build-time schema generation (Prisma 7 requirement)
RUN cd backend && DATABASE_URL="postgresql://user:password@localhost:5432/codeinit" npm run generate

WORKDIR /app/backend

EXPOSE 3001

# Start with npm run dev for hot-reload during development
CMD ["npm", "run", "dev"]
