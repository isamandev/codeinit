# CodeInit - Frontend Engineering Job Board

A modern job board platform for frontend engineering positions with Web Push and Telegram notifications.

## 📁 Monorepo Structure

```
codeinit/
├── frontend/          # Next.js + FSD Architecture
│   ├── app/          # Next.js App Router
│   ├── src/          # FSD layers (entities, features, widgets, shared)
│   └── package.json
│
├── backend/          # NestJS API Server
│   ├── src/          # NestJS modules
│   ├── prisma/       # Database schema
│   └── package.json
│
├── docker-compose.yml # PostgreSQL setup
└── package.json      # Workspace root
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Install dependencies for all workspaces:**
```bash
npm install
```

2. **Start PostgreSQL:**
```bash
npm run docker:up
```

3. **Setup database schema:**
```bash
npm run db:push
```

### Running the Project

**Development mode (both frontend & backend):**
```bash
npm run dev
```

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

### Access URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **Status:** http://localhost:3001/api/status

## 📦 Database

### Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes
npm run db:push

# Create and run migrations
npm run db:migrate

# View Prisma Studio
npm run prisma:studio --workspace=backend
```

## 🏗️ Architecture

### Frontend (Next.js + FSD)

The frontend follows Feature-Sliced Design (FSD) architecture:

- **`_app`** - Global providers, root layout
- **`_pages`** - Page components (one per route)
- **`widgets`** - Reusable UI blocks
- **`features`** - User-facing features
- **`entities`** - Business domain models
- **`shared`** - Shared utilities, components, types

See `frontend/docs/fsd.md` for detailed architecture documentation.

### Backend (NestJS)

Modular architecture with clear separation of concerns:

- **`app.module`** - Main application module
- **`jobs`** - Job CRUD operations (Phase 2)
- **`crawler`** - Job website scraping (Phase 2)
- **`telegram`** - Telegram notifications (Phase 2)
- **`notifications`** - Web Push & email (Phase 2)
- **`scheduler`** - Background jobs (Phase 2)

## 🔄 API Communication

Frontend communicates with backend via HTTP APIs:

```
Frontend (Next.js)
     ↓ HTTP Requests
Backend (NestJS)
     ↓
Database (PostgreSQL)
```

**No Server Actions or API Routes are used for business logic** - all backend logic lives in NestJS.

## 🛠️ Development

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

### Building
```bash
npm run build
```

## 📝 Phase 1 Status

✅ Monorepo structure created
✅ Frontend moved to `/frontend`
✅ Backend skeleton created
✅ Docker Compose setup
✅ Prisma schema defined
✅ Both applications verified

### Phase 2 (Planned)
- [ ] Jobs Module (CRUD API)
- [ ] Crawler Module (Job scraping)
- [ ] Telegram Integration
- [ ] Web Push Notifications
- [ ] Scheduler/Background Jobs

## 📄 License

Private project
