# SearchFlow — Deal Pipeline Tracker

A full-stack deal pipeline tracker for search fund acquisitions. Built with React + Tailwind CSS (frontend) and Express + JSON file storage (backend).

## Features

- **Kanban pipeline board** — Drag and drop deals across 6 stages: Sourced → Contacted → NDA Signed → LOI Submitted → Under Diligence → Closed
- **Deal cards** — Show company name, industry, revenue, EBITDA, asking price, EBITDA multiple, and location at a glance
- **Detail panel** — Click any card to open a slide-in panel with full deal editing and timestamped notes
- **Add deal form** — Modal form to add new acquisition targets with all key fields
- **Pre-populated demo data** — 10 realistic fake deals across HVAC, landscaping, medical billing, IT services, and more
- **Professional UI** — Dark sidebar, clean white content area, blue accent colors

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start both backend and frontend
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/deals

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React 18, Tailwind CSS, Vite  |
| Drag/Drop| @dnd-kit/core                 |
| Icons    | Lucide React                  |
| Backend  | Express (Node.js)             |
| Storage  | Local JSON file               |

## Project Structure

```
searchflow/
├── server/
│   ├── index.js          # Express API server
│   └── data/
│       └── deals.json    # Persistent deal storage
└── client/
    └── src/
        ├── App.jsx                       # Root component + state
        ├── api.js                        # API client
        ├── constants.js                  # Stages, colors, industries
        ├── utils.js                      # Formatting helpers
        └── components/
            ├── Sidebar.jsx               # Dark navigation sidebar
            ├── KanbanBoard.jsx           # DnD context wrapper
            ├── KanbanColumn.jsx          # Individual stage column
            ├── DealCard.jsx              # Draggable deal card
            ├── DealDetailPanel.jsx       # Slide-in edit panel
            └── AddDealModal.jsx          # New deal modal
```

## API Endpoints

| Method | Path                        | Description         |
|--------|-----------------------------|---------------------|
| GET    | /api/deals                  | List all deals      |
| POST   | /api/deals                  | Create a deal       |
| PUT    | /api/deals/:id              | Update a deal       |
| DELETE | /api/deals/:id              | Delete a deal       |
| POST   | /api/deals/:id/notes        | Add a note          |
| DELETE | /api/deals/:id/notes/:nid   | Delete a note       |
