# AGENTS.md

> Read this file before every task. The global `engineering-standards` skill applies
> to all code. This file provides project-specific context that overrides or extends it.

---

## Project

```
name    : Agrisync (PWA)
stack   : React 19 + TypeScript + Vite + Tailwind CSS 4
arch    : Single Page Application (PWA) + Supabase Backend
db      : Supabase (PostgreSQL) + Dexie (Local IndexedDB for Offline)
```

## Active Stack Rules

```
stacks: [react, typescript]
```

## Folder Structure

```
src/
├── components/   # Pure UI components (no business logic)
├── constants/    # tokens.ts, strings.ts, routes.ts, config.ts
├── hooks/        # Custom React hooks (logic)
├── pages/        # Route components
├── schemas/      # Zod validation schemas
├── services/     # API/Database calls (Supabase interactions)
├── store/        # Zustand stores for UI/global state
├── utils/        # Pure helper functions
└── lib/          # Third-party library initialization (supabase.ts, db.ts)
```

## Error Code Registry

| Code               | Status | Meaning                           |
| ------------------ | ------ | --------------------------------- |
| `VALIDATION_ERROR` | 422    | Input validation failed           |
| `UNAUTHENTICATED`  | 401    | Missing or invalid token          |
| `UNAUTHORIZED`     | 403    | Insufficient permissions          |
| `NOT_FOUND`        | 404    | Resource does not exist           |
| `CONFLICT`         | 409    | Duplicate or constraint violation |
| `INTERNAL_ERROR`   | 500    | Unexpected failure                |

## Agent Constraints

Must:

- Propose approach before touching more than one file.
- Add new strings/colors to constants files before referencing them.
- Ask before installing a new dependency.
- Use `react-hook-form` + `zod` for all forms.
- Data fetching must use TanStack Query; UI state uses Zustand.
- No business logic inside components; delegate to hooks or services.

Must not:

- Create or rename folders without approval.
- Leave any TODO, placeholder, or debug output in final code.
- Write inline color values, string literals, or magic numbers.
- Exceed 150 lines per file or 30 lines per function.
