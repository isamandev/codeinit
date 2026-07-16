# OpenSpec Setup Guide

OpenSpec is a lightweight, spec-driven development framework by Fission AI. It's now installed and configured for this project.

## Quick Start

### 1. **Propose a Change** (Create a spec)
```
/opsx:propose "your idea here"
```
This creates a change proposal with a spec delta showing what will change in requirements.

### 2. **Review & Approve**
Review the proposal in `openspec/changes/[change-name]/proposal.md` with design decisions and implementation tasks.

### 3. **Apply the Change** (Implement)
```
/opsx:apply [change-name]
```
Implements the approved change with full-stack modifications (frontend + backend).

### 4. **Archive** (Mark as complete)
```
/opsx:archive [change-name]
```
Archives the completed change and updates the main specs in `openspec/specs/`.

## How It Works

- **Specs Directory**: Living specifications in `openspec/specs/` — checked into git
- **Changes Directory**: Proposals and implementations in `openspec/changes/`
- **Config**: Configuration in `openspec/config.yaml`
- **Workflow**: Propose → Review → Apply → Archive
- **Full-Stack**: Each spec includes both frontend and backend changes together

## Important Rules

1. **NEVER write code before a spec exists** — always propose first
2. **Always use `/opsx:propose`** before implementing anything new
3. **Always use `/opsx:apply`** to implement (never code directly)
4. **Always use `/opsx:archive`** after implementation is complete
5. **Full-stack implementation** — frontend and backend changes together in a single spec

## Development Principles (from CLAUDE.md)

### Keep It Simple
- Implement exactly what the spec requires, nothing more
- Avoid premature abstractions and "nice-to-have" features
- Don't refactor unrelated code

### Write Readable Code
- Use clear, fully-spelled-out names (no abbreviations)
- Meaningful variable and function names (e.g., `userData` not `usrDt`)
- Add comments only when the "why" isn't obvious

### Function Extraction Rules
- Only create a function if the same code appears 2+ times in the same file
- Don't create functions for one-time operations
- Inline simple operations directly

## Available Commands

All commands start with `/opsx:` and work natively in Claude Code:

- **`/opsx:propose`** — Create a new change proposal
- **`/opsx:apply`** — Implement an approved proposal
- **`/opsx:archive`** — Mark a change as complete and update specs
- **`/opsx:explore`** — Browse and search specs
- **`/opsx:sync-specs`** — Keep specs synchronized across changes

## Project Structure

```
openspec/
├── config.yaml           # OpenSpec configuration
├── specs/               # Living specifications
│   └── [feature-name]/
│       └── spec.md
└── changes/             # Active and archived changes
    ├── [change-name]/
    │   ├── proposal.md
    │   ├── design.md
    │   ├── tasks.md
    │   └── specs/
    └── archive/
```

## Resources

- **OpenSpec.dev**: https://openspec.dev
- **GitHub**: https://github.com/Fission-AI/OpenSpec
- **Discord**: https://discord.gg/YctCnvvshC
- **Project Instructions**: See `CLAUDE.md` for full workflow rules
