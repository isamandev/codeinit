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
RUN npm install

# Copy backend source and Prisma schema
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
COPY backend/prisma ./backend/prisma

# Generate Prisma client
RUN cd backend && npm run prisma:generate

WORKDIR /app/backend

EXPOSE 3001

# Start with npm run dev for hot-reload during development
CMD ["npm", "run", "dev"]
