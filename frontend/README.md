# Frontend – Oddo Hackathon 2026

This is the React frontend for the Hackathon project, built with **Vite** for blazing fast development and production builds. It follows a **modular, feature‑ready** structure that keeps code organised and scalable.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS (or any CSS‑in‑JS / Tailwind – your choice)
- **State Management**: React Context (or Redux if added later)
- **Environment**: dotenv via Vite (`VITE_` prefix)

---

## Folder Structure

```
frontend/
├── node_modules/
├── public/                # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── api/               # Axios client + API endpoint functions
│   │   ├── client.js      # Axios instance with interceptors
│   │   ├── authApi.js     # Login, register, logout
│   │   └── sampleApi.js   # Example feature API
│   ├── assets/            # Images, fonts, global styles
│   │   ├── images/
│   │   └── fonts/
│   ├── components/        # Reusable presentational components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Navbar/
│   │   └── Layout/
│   ├── context/           # React Context providers (global state)
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useLocalStorage.js
│   ├── pages/             # Page‑level components (each represents a route)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── utils/             # Helper functions (validators, formatters)
│   │   ├── validators.js
│   │   └── formatDate.js
│   ├── App.css
│   ├── App.jsx            # Main component with routing
│   ├── index.css          # Global styles
│   ├── main.jsx           # Entry point
│   ├── .env               # Environment variables (ignored)
│   └── .env.example       # Example env (committed)
├── .gitignore
├── .env.example           # (also at root if needed)
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| **`src/api/`** | Centralises all API calls. `client.js` sets up Axios with baseURL and interceptors; feature‑specific files (e.g., `authApi.js`) call the client. |
| **`src/assets/`** | Global static files like images, fonts, and any raw CSS/SCSS files shared across the app. |
| **`src/components/`** | Reusable UI building blocks (buttons, modals, cards, layouts). Each component lives in its own folder with its styles and tests. |
| **`src/context/`** | React Context providers for global state (authentication, theme, etc.). |
| **`src/hooks/`** | Custom hooks that encapsulate stateful logic (e.g., `useAuth`, `useLocalStorage`). |
| **`src/pages/`** | Top‑level components that map to routes. They combine components, hooks, and API calls to render full pages. |
| **`src/utils/`** | Pure functions – validation, date formatting, string manipulation, etc. – that are not tied to React. |

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repo and navigate to frontend
cd frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

**`.env.example`** (commit this file):

```env
# Backend API URL (used by Axios)
VITE_API_URL=http://localhost:5000/api

# Optional – app title, feature flags, etc.
# VITE_APP_TITLE=Oddo Hackathon
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).  
The development server supports hot module reload (HMR) for instant updates.

### Building for Production

```bash
npm run build
```

The build output is placed in `dist/` – ready to be served by any static host.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the dev server with hot reload. |
| `npm run build` | Creates a production build in `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint (if configured). |

---