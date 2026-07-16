# Graph Report - .  (2026-07-12)

## Corpus Check
- 6 files · ~22,854 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 447 nodes · 480 edges · 53 communities (44 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_NestJS Backend Dependencies|NestJS Backend Dependencies]]
- [[_COMMUNITY_Book Admin Forms & CRUD|Book Admin Forms & CRUD]]
- [[_COMMUNITY_Books Feature Hooks & Data|Books Feature Hooks & Data]]
- [[_COMMUNITY_Frontend Dev Dependencies|Frontend Dev Dependencies]]
- [[_COMMUNITY_Auth Guards & Toolbar UI|Auth Guards & Toolbar UI]]
- [[_COMMUNITY_Auth & Users Hooks|Auth & Users Hooks]]
- [[_COMMUNITY_Posts Feature & Date Utils|Posts Feature & Date Utils]]
- [[_COMMUNITY_Frontend TypeScript Config|Frontend TypeScript Config]]
- [[_COMMUNITY_Monorepo Root Package Config|Monorepo Root Package Config]]
- [[_COMMUNITY_Backend TypeScript Config|Backend TypeScript Config]]
- [[_COMMUNITY_Architecture & Infrastructure Docs|Architecture & Infrastructure Docs]]
- [[_COMMUNITY_FSD Boundary Checker|FSD Boundary Checker]]
- [[_COMMUNITY_Frontend Runtime Dependencies|Frontend Runtime Dependencies]]
- [[_COMMUNITY_NestJS App Controller|NestJS App Controller]]
- [[_COMMUNITY_Root Layout & Footer|Root Layout & Footer]]
- [[_COMMUNITY_Export JSON Panel Tool|Export JSON Panel Tool]]
- [[_COMMUNITY_Harry Potter Book Sample Data|Harry Potter Book Sample Data]]
- [[_COMMUNITY_Books Public Layout|Books Public Layout]]
- [[_COMMUNITY_Edit Post Dashboard Page|Edit Post Dashboard Page]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Vercel Brand Asset|Vercel Brand Asset]]
- [[_COMMUNITY_Panel Books Add Page|Panel Books Add Page]]
- [[_COMMUNITY_Panel Books Edit Page|Panel Books Edit Page]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_OpenRouter AI Integration|OpenRouter AI Integration]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 19 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 16 edges
4. `scripts` - 9 edges
5. `scripts` - 8 edges
6. `paths` - 8 edges
7. `CodeInit Project README` - 7 edges
8. `AppService` - 6 edges
9. `useAuth()` - 6 edges
10. `OpenSpec Spec-Driven Workflow` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Monorepo Structure (frontend + backend workspaces)` --semantically_similar_to--> `FSD Layer Hierarchy`  [INFERRED] [semantically similar]
  README.md → frontend/docs/fsd.md
- `CodeInit Project README` --references--> `Docker Compose Configuration`  [EXTRACTED]
  README.md → docker-compose.yml
- `CodeInit Project README` --references--> `FSD Architecture Documentation`  [EXTRACTED]
  README.md → frontend/docs/fsd.md
- `Monorepo Structure (frontend + backend workspaces)` --references--> `Feature-Sliced Design Methodology`  [INFERRED]
  README.md → frontend/docs/fsd.md
- `Prisma ORM and Database Schema` --shares_data_with--> `PostgreSQL Docker Service (postgres:16-alpine)`  [INFERRED]
  README.md → docker-compose.yml

## Import Cycles
- None detected.

## Communities (53 total, 9 thin omitted)

### Community 0 - "NestJS Backend Dependencies"
Cohesion: 0.06
Nodes (10): CreateBookArg, Props, Button(), ButtonProps, CreatePostArg, PostForm(), Props, ColumnType (+2 more)

### Community 1 - "Book Admin Forms & CRUD"
Cohesion: 0.07
Nodes (10): Book, useBooks(), BookEditForm(), Props, DashboardBooksList(), BookCardProps, BookDetail(), Props (+2 more)

### Community 2 - "Books Feature Hooks & Data"
Cohesion: 0.11
Nodes (14): Me, useAuth(), User, useUsers(), AuthGuard(), AuthGuardProps, Header(), signAuthToken() (+6 more)

### Community 3 - "Frontend Dev Dependencies"
Cohesion: 0.07
Nodes (26): description, devDependencies, concurrently, name, private, scripts, build, build:backend (+18 more)

### Community 4 - "Auth Guards & Toolbar UI"
Cohesion: 0.08
Nodes (25): dependencies, bcryptjs, clsx, dayjs, jalaliday, jsonwebtoken, next, react (+17 more)

### Community 5 - "Auth & Users Hooks"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+17 more)

### Community 6 - "Posts Feature & Date Utils"
Cohesion: 0.10
Nodes (5): AuthToolbar(), metadata, metadata, sidebarLinks, Item

### Community 7 - "Frontend TypeScript Config"
Cohesion: 0.16
Nodes (10): usePosts(), toJalali(), fetcher(), cn(), ArticleRecord, Post, PostSummary, PostsList() (+2 more)

### Community 8 - "Monorepo Root Package Config"
Cohesion: 0.09
Nodes (22): dependencies, class-transformer, class-validator, @nestjs/common, @nestjs/core, @nestjs/platform-express, @prisma/client, reflect-metadata (+14 more)

### Community 9 - "Backend TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, baseUrl, declaration, declarationMap, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+13 more)

### Community 10 - "Architecture & Infrastructure Docs"
Cohesion: 0.18
Nodes (4): Footer(), metadata, SWRProvider(), vazirmatnFD

### Community 11 - "FSD Boundary Checker"
Cohesion: 0.20
Nodes (15): Docker Compose Configuration, PostgreSQL Docker Service (postgres:16-alpine), FSD Architecture Documentation, Boundary Enforcement Script (check-boundaries.js), Feature-Sliced Design Methodology, FSD Layer Hierarchy, Public API Rule (index.ts as single contract per slice), FSD Segment Conventions (ui/model/api/lib/config/layout) (+7 more)

### Community 12 - "Frontend Runtime Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, madge, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+7 more)

### Community 13 - "NestJS App Controller"
Cohesion: 0.19
Nodes (12): APP_ROUTER, checkAppRouterImport(), checkImport(), fromLayerAndSlice(), fs, LAYER_ORDER, layerOf(), path (+4 more)

### Community 14 - "Root Layout & Footer"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @nestjs/cli, @nestjs/schematics, prisma, ts-loader, ts-node, tsconfig-paths (+5 more)

### Community 15 - "Export JSON Panel Tool"
Cohesion: 0.23
Nodes (3): AppController, AppModule, AppService

### Community 16 - "Harry Potter Book Sample Data"
Cohesion: 0.22
Nodes (11): Avoid Over-Engineering Principle, Full-Stack Implementation Principle, Function Extraction Rules, Graphify Knowledge Graph Integration, graphify-out/ Knowledge Graph Directory, Junior-Friendly Code Principle, Naming Conventions, OpenSpec Spec-Driven Workflow (+3 more)

### Community 18 - "Edit Post Dashboard Page"
Cohesion: 0.33
Nodes (6): J.K. Rowling, Hagrid (character), Harry Potter (character), Harry Potter and the Philosopher's Stone - Book Cover, Bloomsbury Publishing, Hogwarts Castle (setting)

### Community 28 - "Window Icon Asset"
Cohesion: 1.00
Nodes (3): Next.js Framework, Next.js Wordmark Logo, next.svg Static Asset

### Community 29 - "Next.js Config"
Cohesion: 1.00
Nodes (3): Globe SVG Icon, SVG Path Shape (fill-rule evenodd), Globe / World Map Visual Concept

### Community 30 - "PostCSS Config"
Cohesion: 1.00
Nodes (3): Window SVG Icon, Window Control Dots (Traffic Lights), Browser Window UI Element

## Knowledge Gaps
- **181 isolated node(s):** `name`, `version`, `private`, `description`, `dev` (+176 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthGuard()` connect `Books Feature Hooks & Data` to `Posts Feature & Date Utils`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _183 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `NestJS Backend Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._
- **Should `Book Admin Forms & CRUD` be split into smaller, more focused modules?**
  _Cohesion score 0.06722689075630252 - nodes in this community are weakly interconnected._
- **Should `Books Feature Hooks & Data` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Frontend Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Auth Guards & Toolbar UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._