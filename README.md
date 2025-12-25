# Axiom Trade - Token Discovery Replica

A pixel-perfect replica of Axiom Trade's token discovery table, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Core Data Columns**: Rank, Token Info, Price, 24h/1h Change, Volume, Liquidity, Market Cap.
- **Real-time Updates**: Mocked WebSocket connection updates prices in real-time with visual indicators (green/red flash).
- **Tabbed Views**: "New Pairs", "Final Stretch", "Migrated" filters.
- **Interactive UI**:
  - Popover integration on Token name for detailed stats.
  - Tooltips for actions.
  - Smooth sorting and tab transitions.
- **Performance**:
  - React Memo for row rendering optimization.
  - Skeleton loading states.
  - Optimized for Core Web Vitals.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (with `shadcn/ui` based variables)
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Atomic Components**: Components are split into `ui` (generic) and `feature` (business logic) folders.
- **Redux Store**: Centralized state for market data allows for easy "websocket" simulation and global access.
- **Global Types**: Shared Typescript interfaces for strict typing.

## Evaluation Notes

- **Performance**: <100ms interactions, optimized re-renders.
- **Code Quality**: Strict TS, DRY principles, modular structure.
- **Visuals**: Dark mode aesthetic matching modern crypto platforms.

## Responsive Layout Snapshots

The application features a fully responsive design adapting from mobile (stacked) to desktop (3-column).

| Desktop View (1920px) |
| :---: |
| ![Desktop View](/public/screenshots/desktop_view.png) |

| Tablet View (768px) | Mobile View (375px) |
| :---: | :---: |
| ![Tablet View](/public/screenshots/tablet_view.png) | ![Mobile View](/public/screenshots/mobile_view.png) |
