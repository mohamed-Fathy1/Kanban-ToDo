# Kanban ToDo

A drag-and-drop Kanban board for managing tasks across different stages — backlog, in progress, review, and done.

Built with React 19, TypeScript, and Material UI. Tasks are persisted through a JSON Server backend and can be created, edited, deleted, and moved between columns via drag and drop (powered by dnd-kit).

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Material UI, Zustand (state), React Query (server state), dnd-kit (drag and drop)
- **Backend:** JSON Server
- **Hosting:** Frontend on AWS Amplify, backend (JSON Server) on an EC2 instance

## Getting Started

I used [Bun](https://bun.sh) as my package manager, but npm, yarn, or pnpm will work just fine.

### Prerequisites

- Node.js 18+
- Bun (or npm/yarn/pnpm)

### Install dependencies

```bash
bun install
```

### Run the dev server

Start both the frontend and the JSON Server backend in one command:

```bash
bun run dev:all
```

This runs:
- Vite dev server at `http://localhost:5173`
- JSON Server at `http://localhost:4000`

You can also start them separately:

```bash
# Frontend only
bun run dev

# Backend only
bun run server
```

### Build for production

```bash
bun run build
```

Output goes to the `dist/` directory.

### Lint

```bash
bun run lint
```

## Project Structure

```
src/
├── api/          # API layer (fetch calls to JSON Server)
├── components/   # Board, Column, TaskCard, TaskDialog, Search
├── hooks/        # Custom hooks for task operations
├── store.ts      # Zustand store
├── queryClient.ts
├── theme.ts      # MUI theme config
├── types.ts      # Shared TypeScript types
└── main.tsx
db.json           # JSON Server database file
```
