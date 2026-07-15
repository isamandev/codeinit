# Feature-Sliced Design — Project Architecture

## What is FSD

Feature-Sliced Design (FSD) is an architectural methodology for scaffolding front-end applications. It organizes code into a strict hierarchy of **layers**, each layer split into **slices** by business domain, each slice split into **segments** by technical purpose. The one rule that holds the whole thing together: a module can only import from layers **strictly below** it — never sideways, never up.

This project adopted FSD because the codebase mixes several independent domains (books, posts, users/auth) behind shared UI chrome (header, sidebar, footer) and several route groups (public site, `/dashboard`, `/panel`). Before the migration, code for a single domain (e.g. "books") was scattered across `components/`, `features/`, and `shared/lib/`, and Next.js page files contained business logic directly. FSD gives each domain one home, keeps the Next.js router as a thin routing shell, and makes the allowed import directions explicit and mechanically checkable (`scripts/check-boundaries.js`).

## Layer Hierarchy

Because this is a Next.js App Router project, the `app` and `pages` FSD layers are renamed `_app` and `_pages` (underscore-prefixed) to avoid colliding with Next.js's own `app/` router directory, which lives at the **project root**, outside `src/`. This is the official FSD convention for Next.js (see `docs/guides/tech/with-nextjs`).

```
        highest
┌────────────────────┐
│       _app          │  global providers, root layout, app-wide config
├────────────────────┤
│      _pages          │  one slice per route, composes widgets/features
├────────────────────┤
│      widgets         │  large self-sufficient UI blocks (Header, Sidebar…)
├────────────────────┤
│      features        │  user-facing actions (create post, edit book…)
├────────────────────┤
│      entities        │  business concepts (Book, Post, User)
├────────────────────┤
│      shared          │  generic, business-agnostic infrastructure
└────────────────────┘
        lowest
```

`app/` (project root, outside `src/`) is the Next.js router itself. It contains no logic — every `page.tsx` and `layout.tsx` there is a one-line re-export from `src/_pages` or `src/_app`.

## Each Layer — Purpose and Rules

### `_app` (`src/_app/`)

**What belongs here:** app-wide providers and the root layout composition — things every page needs regardless of route.

- `src/_app/providers/SWRProvider.tsx` — the global SWR fetcher config, wraps the whole app.
- `src/_app/layout/RootLayout.tsx` — composes `Header`, `Footer`, and `SWRProvider` around `{children}`; owns the root `<html>`/`<body>` and site-wide `metadata`.

**Can import from:** `_pages`, `widgets`, `features`, `entities`, `shared`.
**Must NOT import from:** nothing above it — it's the top of the stack.

`app/layout.tsx` (root Next.js router file) is just:
```ts
export { RootLayout as default, rootLayoutMetadata as metadata } from "@/_app/layout";
```

### `_pages` (`src/_pages/`)

**What belongs here:** one slice per route/screen. A `_pages` slice owns the page's top-level composition (which widgets/features it renders, in what layout) but delegates actual business logic to `features` and `entities`.

Real slices in this project:
- `src/_pages/home` → `HomePage` (rendered at `/`)
- `src/_pages/books`, `src/_pages/books/add`, `src/_pages/books/detail` → `/books`, `/books/add`, `/books/books/[bookId]`
- `src/_pages/posts`, `src/_pages/posts/detail` → `/posts`, `/posts/[postId]`
- `src/_pages/auth/login`, `src/_pages/auth/register` → `/auth/login`, `/auth/register`
- `src/_pages/dashboard/**` → the whole `/dashboard` route tree, including its own `layout/DashboardLayout.tsx`
- `src/_pages/panel/**` → the whole `/panel` route tree, including its own `layout/PanelLayout.tsx`

**Can import from:** `widgets`, `features`, `entities`, `shared`.
**Must NOT import from:** `_app`, or a sibling `_pages` slice (e.g. `src/_pages/panel/books` may not reach into `src/_pages/dashboard`).

Example — `src/_pages/panel/books/ui/PanelBooksPage.tsx` renders the `features/book-management` slice's `DashboardBooksList`, imported through that feature's public API:
```ts
import { DashboardBooksList } from "@/features/book-management";
```

### `widgets` (`src/widgets/`)

**What belongs here:** large, composite, page-agnostic UI blocks — reused across multiple pages or complex enough to deserve their own slice, but without owning a specific business scenario.

Real slices: `header`, `footer`, `sidebar`, `books-list`, `books-scroller`, `posts-list`.

**Can import from:** `features`, `entities`, `shared`.
**Must NOT import from:** `_pages`, `_app`, or a sibling widget slice.

Example — `src/widgets/header/Header.tsx` reads the current user via the `entities/user` public API:
```ts
import { useAuth } from "@/entities/user";
```

### `features` (`src/features/`)

**What belongs here:** a single user-facing action or scenario, usually a form or a management workflow that mutates data.

Real slices:
- `auth` — `AuthGuard` (route protection), `AuthToolbar` (logout)
- `book-management` — `BookForm`, `BookEditForm`, `DashboardBooksList`
- `post-management` — `PostForm`
- `user-management` — `UsersListClient`
- `export-json` — `ExportJsonClient`

**Can import from:** `entities`, `shared`.
**Must NOT import from:** `widgets`, `_pages`, `_app`, or a sibling feature slice.

### `entities` (`src/entities/`)

**What belongs here:** real business concepts — their data shape, and the presentational components/hooks tied directly to that concept.

Real slices: `book`, `post`, `user`.

**Can import from:** `shared`, and — as a documented FSD exception — other entities (e.g. a `book` reusing a `post`'s record shape), since entities are allowed to reference each other directly.
**Must NOT import from:** `features`, `widgets`, `_pages`, `_app`.

Example — `src/entities/book/ui/BookCard.tsx` is a pure presentational component; `src/entities/user/api/useAuth.ts` is a client-side SWR hook. Both are exposed only through `src/entities/book/index.ts` / `src/entities/user/index.ts`.

### `shared` (`src/shared/`)

**What belongs here:** generic, business-agnostic infrastructure with no knowledge of any domain concept — reusable across any project, not just this one.

- `src/shared/lib/` — `cn` (classnames), `fetcher` (generic HTTP GET), `toJalali` (date formatting)
- `src/shared/ui/` — `Button`, `Table`, `DraggableScroller`
- `src/shared/config/fonts/` — the Vazirmatn font setup (`next/font/local`)

**Can import from:** other `shared` code only.
**Must NOT import from:** anything above it.

## Segment Conventions

Within a slice, code is grouped by **technical role**, not further business meaning:

| Segment | Purpose | Example in this project |
|---|---|---|
| `ui` | Components, formatters tied to rendering | `src/entities/post/ui/PostCard.tsx` |
| `model` | Data shapes, types, pure business logic | `src/entities/post/model/types.ts` (`Post`, `PostSummary`, `ArticleRecord`) |
| `api` | Data-fetching, backend interaction (here: SWR hooks) | `src/entities/book/api/useBooks.ts` |
| `lib` | Reusable helpers used by other modules in the same slice/layer | `src/shared/lib/date.ts` |
| `config` | Configuration, feature flags, setup code | `src/shared/config/fonts/` |
| `layout` | Page-level layout composition (custom segment, `_pages`/`_app` only) | `src/_pages/dashboard/layout/DashboardLayout.tsx` |

Segment names describe *purpose*, never generic catch-alls like `components/`, `utils/`, or `hooks/` at the slice root — that's the "desegmented slice" anti-pattern FSD explicitly warns against. This is also why the entity SWR hooks moved from a bare `hooks/` folder to the `api/` segment: fetching data is what `api` means in FSD, regardless of *how* it fetches (REST call, SWR hook, GraphQL query).

## Public API Rule

Every slice exposes exactly one contract: its `index.ts`. Consuming code must import the slice by its root path (`@/entities/book`), never by reaching into a segment file directly (`@/entities/book/ui/BookCard`). This means:

- The slice's internal file layout can be refactored freely without breaking consumers.
- The slice controls exactly what's public — internal helpers stay internal by simply not being re-exported.
- Wildcard re-exports (`export * from "./x"`) are avoided in favor of explicit named exports, so the public surface is visible at a glance from the `index.ts` itself.

Every slice in `src/entities`, `src/features`, `src/widgets`, and every route slice in `src/_pages` has its own `index.ts`. `src/shared/ui`'s three components (`button`, `table`, `draggable-scroller`) each have their own `index.ts` too, aggregated by `src/shared/ui/index.ts`.

## Server vs Client boundary

Some slices contain both client-safe code (React components, SWR hooks) and server-only code (anything that touches Node built-ins or secrets). Bundling both through a single `index.ts` breaks the client build the moment a client component imports the barrel — the bundler tries to include the server-only code in the browser bundle.

This project's `entities/post` and `entities/user` slices hit exactly this problem: `index.ts` re-exported both client hooks (`usePosts`, `useAuth`) and server-only functions (`signAuthToken`, `verifyAuthToken`, `safeUser`). The fix, per FSD's own guidance for this situation, is to split the public API by runtime:

- `index.ts` — client-safe exports only (components, hooks, types). Safe to import from any component, client or server.
- `index.server.ts` — server-only exports (functions touching `fs`, secrets, or Node-only packages). Must only be imported from Server Components or Route Handlers, never from a `"use client"` file.

```ts
// src/entities/user/index.ts        (client-safe)
export type { User } from "./model/user";
export { useAuth } from "./api/useAuth";
export { useUsers } from "./api/useUsers";

// src/entities/user/index.server.ts (server-only)
export { safeUser } from "./model/user";
export { signAuthToken, verifyAuthToken } from "./model/auth";
```

## Import Direction Cheatsheet

| From \ To | `shared` | `entities` | `features` | `widgets` | `_pages` | `_app` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `shared` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `entities` | ✅ | ✅ (sibling entities allowed) | ❌ | ❌ | ❌ | ❌ |
| `features` | ✅ | ✅ | ❌ (no sibling features) | ❌ | ❌ | ❌ |
| `widgets` | ✅ | ✅ | ✅ | ❌ (no sibling widgets) | ❌ | ❌ |
| `_pages` | ✅ | ✅ | ✅ | ✅ | ❌ (no sibling pages) | ❌ |
| `_app` | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| `app/` (router, root) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
