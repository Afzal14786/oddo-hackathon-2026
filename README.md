# TransitOps – Smart Transport Operations Platform

> **Hackathon Project for Oddo Hackathon 2026**

TransitOps is a full‑stack transport management platform that digitizes vehicle, driver, dispatch, maintenance, and expense tracking. It replaces spreadsheets with a centralized system, enforcing business rules and providing real‑time operational insights.

---

## Live Demo

- **Frontend (Vercel):** [https://oddo-hackathon-2026-nvab.vercel.app/](https://oddo-hackathon-2026-nvab.vercel.app/)
- **Backend API:** (Deployed separately – check environment variables)

---

## Video Walkthrough

Watch the full demo on YouTube:  
[TransitOps – Demo Video](https://youtu.be/JaaFWJo7fn8?si=ZUgjXyar8d7Ug3yW)

---

## Features

- **Authentication** – Secure login/register with JWT and httpOnly cookies, role‑based access control.
- **Dashboard** – Live KPIs: active/available/in‑maintenance vehicles, active/pending trips, drivers on duty, fleet utilization.
- **Vehicles** – Full CRUD with registration, model, type, capacity, cost, odometer, status.
- **Drivers** – Manage profiles, licenses (with expiry alerts), safety scores, and status.
- **Trips** – Complete lifecycle: Draft → Dispatched → Completed/Cancelled. Enforces capacity, license validity, and availability rules.
- **Maintenance** – Log repairs and inspections; auto‑updates vehicle status to "In Shop" and restores on close.
- **Finance** – Track fuel logs and expenses (tolls, repairs, etc.) with Indian Rupee formatting.
- **Reports** – Fuel efficiency, operational cost, vehicle ROI, and CSV export.

---

## Tech Stack

### Frontend
- React 19 + Vite
- React Router DOM
- Axios (with interceptors)
- Tailwind CSS
- Lucide React icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication with httpOnly cookies
- Role‑based access control
- Business rule enforcement (status transitions, validations)

---

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Afzal14786/oddo-hackathon-2026.git
cd oddo-hackathon-2026
```  

### 2. Backend Setup  
```bash
cd backend
npm install
cp .env.example .env   # Fill in your MongoDB URI and JWT secret
npm run dev
```

> The backend will run on `http://localhost:5000` (or your configured port).  

### 3. Frontend Setup  
```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_BASE_URL to your backend URL
npm run dev
```  

> The frontend will run on `http://localhost:5173`.  

### 4. Environment Variables  

**Backend (`backend/.env`)**  

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173   # For CORS
```  
**Frontend (`frontend/.env`)**  
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```  

---  

## Project Structure  

```text
.
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── module/          # Feature modules (auth, vehicles, drivers, trips, ...)
│   │   ├── shared/          # Middlewares, utils, constants
│   │   └── app.js
│   └── package.json
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios clients for each resource
│   │   ├── pages/           # All page components
│   │   ├── components/      # Reusable UI (Sidebar, StatusBadge, etc.)
│   │   ├── context/         # Auth context
│   │   └── App.jsx
│   └── package.json
├── README.md
└── .gitignore
```  
---  

## Team 

* [Afzal](https://github.com/afzal14786) - Backend Developer
* [Kajal Yaduvanshi](https://github.com/kajal824)  - Frontend Developer