# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dread+ is a World of Warcraft: The War Within Season 3 Mythic Plus tracker. It fetches real-time data from the Raider.IO API to display team member scores, dungeon progression, and weekly affixes.

## Commands

```bash
npm start         # Start React dev server (port 3000)
npm test          # Run Jest tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
npm run build     # Production build to /build
node src/server.js  # Start Express backend (port 5000) - requires OPENAI_API_KEY in .env
```

## Architecture

### Data Flow
- `src/teamMembers.js` defines the static list of WoW characters to track (server + name)
- `App.js` fetches all team member data from Raider.IO API on mount, stores in `characters` and `dungeonData` state
- Data flows down: App → Member (player cards) → MemberDetails (expanded view) → DungeonBreakdown (grid)

### Key Components
- **App.js**: Main container, manages all state, handles API calls to raider.io
- **Member.jsx**: Player card displaying score, class, spec with color-coded ratings (uses `scoreColorMapping`)
- **DungeonBreakdown.jsx**: Grid showing Fortified/Tyrannical runs per player, supports click-to-highlight comparison
- **MemberDetails.jsx**: Expanded view when clicking a player card

### Backend (Optional)
- `src/server.js`: Express server with OpenAI integration for WoW class/spec chat completions (not used by default frontend)

### Routing
Uses react-router-dom v6:
- `/` - Main tracker view
- `/playlists` - Playlists page

### External APIs
- **Raider.IO API**: Character profiles, mythic+ scores, best runs, affixes (no auth required)
- **OpenAI API**: Backend chat completions (requires `OPENAI_API_KEY` env var)

## Tech Stack
- React 18 with Create React App
- Express backend (optional)
- D3.js (imported but minimal usage currently)
- Axios for HTTP requests
- Hosted on Vercel (Node 20 LTS)
