# PokéTracker Frontend

Frontend application for PokéTracker — a field data tool used by Pokémon Rangers to log, review, and act on wildlife sightings.

## Tech Stack

- **React + Vite + TypeScript** — SPA with fast HMR
- **TanStack Router** — file-based client routing with URL-synced search params
- **TanStack Query** — server state management with optimistic updates
- **TanStack Table** — headless table for paginated sightings view
- **TanStack Form** — form state management with Zod validation
- **Tailwind CSS v4 + shadcn/ui** — styling and UI component library
- **@xyflow/react** — workflow builder canvas
- **recharts** — analytics charts (via shadcn chart wrapper)

## Prerequisites

- Node.js 18+
- pnpm 9+

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

## Build

```bash
pnpm build
```

## Features

### Sightings Table
- Server-side paginated table with page size selector (25/50/100/200)
- Filters: Pokémon name, region, weather, time of day, date range
- All filter state synced to URL search params
- Optimistic delete with automatic rollback on error
- "Log Sighting" modal form with Pokémon typeahead search
- No blank flashes during loading (keepPreviousData)

### Workflow Builder
- List page with workflow cards showing name, node count, and creation date
- Visual node-based editor powered by React Flow
- Three node types: Trigger, Filter (dual match/no-match outputs), Action
- Drag-and-drop or click-to-add from node palette
- Right-side configuration panel for selected nodes
- Explicit Save button with unsaved changes indicator
- Delete nodes via panel, keyboard (Delete/Backspace), or on deletion in canvas

### Analytics Dashboard
- Stat cards: total sightings, confirmed count, shiny count/rate, unique species
- Charts: sightings per month, by weather, by time of day, top 10 Pokémon, by rarity tier
- Region and date range filters synced to URL

## Project Structure

```
src/
  main.tsx              # App entry point
  routes/               # TanStack Router file-based routes
    __root.tsx           # Root layout with sidebar
    sightings/           # Sightings feature
    workflows/           # Workflow builder feature
    analytics/           # Analytics dashboard
  components/            # Shared components
    ui/                  # shadcn/ui components
    data-table/          # Reusable DataTable
  hooks/                 # TanStack Query hooks
  types/                 # TypeScript type definitions
  lib/                   # API client and utilities
```
