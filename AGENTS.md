# Project Instructions

This project uses OpenSpec for spec-driven development.

## Rules

- NEVER write code before a spec exists for the change.
- ALWAYS use /opsx:propose before implementing anything new.
- ALWAYS use /opsx:apply to implement (never code directly).
- ALWAYS use /opsx:archive after implementation is complete.
- If asked to build something without a proposal, create the proposal first and wait for approval.

## Development Principles

### Full-Stack Implementation

- Every task MUST include both frontend and backend changes together in a single spec.
- Do not separate frontend and backend into different proposals or implementations.
- Each feature should be delivered end-to-end with all necessary API endpoints, UI components, and data flow.

### Avoid Over-Engineering

- Keep solutions simple and straightforward.
- Do not add patterns, abstractions, or technologies "just in case" they might be needed later.
- Only implement what is explicitly required by the spec.
- Resist the urge to refactor unrelated code or add "nice-to-have" features.
- If a feature can be implemented in 50 lines, do not write 200 lines.
- Do NOT create helper functions for code that is only used once in a file.
- Do NOT extract simple single-line operations into separate functions.

### Junior-Friendly Code

- Write code that is easy to read and understand for a junior developer.
- Use clear, descriptive variable and function names.
- NEVER use abbreviations or acronyms (e.g., use `userData` not `usrDt`, `calculateTotal` not `calcTot`).
- Break complex logic into small, well-named helper functions only when the same logic is used multiple times.
- Add comments only when the "why" is not obvious (avoid commenting the "what").
- Prefer simple conditional logic over nested ternaries or complex one-liners.
- Use consistent formatting and follow the project's style guide.

### Naming Conventions

- All names MUST be fully spelled out (no abbreviations).
- Use meaningful names that convey intent (e.g., `getUserProfileById` not `getUsr`).
- Boolean variables should start with `is`, `has`, or `should` (e.g., `isValid`, `hasPermission`).
- Functions should be named with verbs (e.g., `fetchUserData`, `validateFormInput`).
- Variables should be nouns (e.g., `userList`, `productPrice`).
- Avoid single-letter variable names except for loop indices in short loops.

### Function Extraction Rules

- Only create a function if the same code logic is used in 2 or more places within the same file.
- Do NOT create functions for one-line operations used only once (e.g., simple string formatting, single calculations).
- Do NOT extract code into functions just to "make it cleaner" or "improve organization".
- Inline simple operations directly where they are used.

## Frontend Architecture (Feature-Sliced Design)

The frontend (`frontend/src/`) follows [Feature-Sliced Design](https://feature-sliced.design/). Layers, from highest to lowest:

`app` → `pages` → `widgets` → `features` → `entities` → `shared`

A slice on a higher layer may only import from lower layers, never sideways or upward.

- **`app`**: app-wide setup — providers, root layout, global routing.
- **`pages`**: one slice per route/screen. A page's own `ui/` folder holds any UI that belongs only to that page.
- **`widgets`**: large, self-sufficient UI blocks reused across multiple pages, or an independent large block within a single page.
- **`features`**: main user interactions ("things users care to do" — submit a form, toggle a setting, add a comment). **Not everything needs to be a feature.** The test for whether something belongs here is reuse: if it's used on more than one page/widget, it's a feature; if it appears once and never gets reused, it stays in the page's own `ui/` folder instead.
- **`entities`**: real-world business concepts the app works with (User, Book, Post) — their model/types and the UI for displaying them (cards, avatars).
- **`shared`**: the foundation with no business logic — UI kit (e.g. shadcn components), API clients, generic utils, config. Nothing here should know about app-specific concepts.

Rules:
- **One slice per domain concept.** Do not create multiple feature slices for the same concept (e.g. one `features/auth` slice, never `features/auth` + `features/auth-forms`). If related pieces (session guard, login form, logout) all belong to "auth," they live together in one `features/auth` slice — unless a piece is only used on a single page, in which case it belongs in that page's `ui/` folder instead of the feature at all.
- **Single-page UI is not a feature or widget.** If a block of UI (e.g. a form) is only ever rendered on one page, put it directly in that page's own `ui/` folder (`pages/<page>/ui/`), not in `features/` or `widgets/`. Promote it to a feature/widget only when a second page needs to reuse it.
- Before creating a new feature slice, check whether an existing slice for the same concept already exists and extend that instead.

## Workflow Summary

1. **Propose** → Create spec for the change using /opsx:propose
2. **Review** → Get approval on the spec before proceeding
3. **Apply** → Implement the spec using /opsx:apply (full-stack, simple, readable)
4. **Archive** → Archive the completed spec using /opsx:archive

## Commit Convention

Use emoji-prefixed commits following [this convention](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13):

- **✨ feat**: New feature or functionality
- **🐛 fix**: Bug fix
- **📚 docs**: Documentation changes (README, guides, etc.)
- **🎨 style**: Code style/formatting or presentation changes
- **♻️ refactor**: Code restructuring without changing behavior
- **⚡ perf**: Performance improvements
- **✅ test**: Adding or updating tests
- **🔧 chore**: Build process, dependencies, tooling, configuration
- **🔐 security**: Security-related fixes or improvements

**Format**: `<emoji> <type>: <description>`

**Description rules**:
- First line: concise summary (under 70 characters)
- Body: detailed explanation of what and why (optional but recommended for significant changes)
- No co-authored-by footer in the message body

**Example**:
```
✨ feat: add user authentication with JWT tokens

- Implement login/register endpoints
- Add JWT token generation and validation
- Create authentication middleware for protected routes
```

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
