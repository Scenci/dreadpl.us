Dread+

The War Within: Season 3 Mythic Plus Tracker
Website: https://dreadpl.us

📜 About

Dread+ is a World of Warcraft: The War Within Season 3 companion site for our Mythic Plus team.
It automatically tracks scores, dungeon progression, and affixes, plus includes an interactive Dungeon Highlighting Tool to see who else has completed what keys at a glance.
✨ Features

    Live Raider.IO Score Tracking for each team member

    Dungeon Breakdown (Fortified & Tyrannical) per player

    Clickable Dungeon Highlights to instantly compare key completions across the team

    Weekly Affix Display (The War Within S3)

    Useful Links Hub for quick access to tools, logs, and calculators

    Responsive UI for desktop and mobile viewing

🖼 Example View

The top section shows your team’s player cards:

    Character name, class, spec, score, and quick Raider.IO link

    Color-coded scores based on rating

    “Hide” toggle to customize view

The bottom section shows the Dungeon Breakdown Grid for each player:

    Separate Fortified and Tyrannical columns

    Key level per dungeon

    Highlighted cells when clicking a dungeon name in the header

🛠 Tech Stack

    Frontend: React 18 (CRA)

    Backend: Express + Axios for API calls

    Styling: Custom CSS + utility classes

    APIs: Raider.IO, Warcraft Logs (future integration)

    Hosting: Vercel (Node 20 LTS)

    CI/CD: GitHub → Vercel automatic previews

🚀 Development

# Clone repo
git clone https://github.com/Scenci/dreadpl.us.git
cd dreadpl.us

# Use Node 20
nvm use

# Install deps
npm ci

# Run dev server
npm start

# Run tests
npm test

# Build production
npm run build

📂 Project Structure

src/
  components/     # Reusable UI pieces
  pages/          # Main page views
  services/       # API calls and helpers
  styles/         # CSS & theme
  App.js          # App entry
