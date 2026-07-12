# TransitOps – Frontend

Smart Transport Operations Platform – React frontend built with Vite.

This is the frontend for the TransitOps hackathon project. It provides a responsive dashboard, CRUD interfaces for vehicles/drivers/trips, maintenance workflow, fuel/expense logging, and analytics reports.

---

## Live Demo

**Deployed URL:** [https://oddo-hackathon-2026-nvab.vercel.app/](https://oddo-hackathon-2026-nvab.vercel.app/)

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context (Auth)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Environment**: dotenv (VITE_ prefix)

---

## Folder Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   ├── authApi.js
│   │   ├── client.js
│   │   ├── driversApi.js
│   │   ├── fuelApi.js
│   │   ├── index.js
│   │   ├── maintenanceApi.js
│   │   ├── reportsApi.js
│   │   ├── tripsApi.js
│   │   └── vehiclesApi.js
│   ├── components/
│   │   ├── ConfirmDialog.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Spinner.jsx
│   │   └── StatusBadge.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Drivers/
│   │   │   ├── DriverForm.jsx
│   │   │   └── DriverList.jsx
│   │   ├── Finance/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── FinanceLogs.jsx
│   │   │   └── FuelLogForm.jsx
│   │   ├── Maintenance/
│   │   │   ├── MaintenanceForm.jsx
│   │   │   └── MaintenanceList.jsx
│   │   ├── Reports/
│   │   │   └── ReportsDashboard.jsx
│   │   ├── Trips/
│   │   │   ├── CompleteTripModal.jsx
│   │   │   ├── TripForm.jsx
│   │   │   └── TripList.jsx
│   │   ├── Vehicles/
│   │   │   ├── VehicleForm.jsx
│   │   │   └── VehicleList.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── vercel.json
└── vite.config.js
```  

---

## Pages & Features

| Page | Description |
|------|-------------|
| **Login / Register** | Authentication with role-based access (Fleet Manager, Driver, Safety Officer, Financial Analyst). |
| **Dashboard** | Displays KPIs: Active Vehicles, Available Vehicles, In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization (%). Filter by vehicle type/status/region. |
| **Vehicles** | Full CRUD; list, add, edit, retire vehicles. Status badges (Available, On Trip, In Shop, Retired). |
| **Drivers** | Full CRUD; manage driver profiles, license validity, safety score, status. |
| **Trips** | Create trips with source, destination, vehicle/driver selection (enforces business rules), cargo weight validation. Lifecycle: Draft -> Dispatched -> Completed -> Cancelled. Auto-updates vehicle/driver statuses. |
| **Maintenance** | Log maintenance records; vehicle status automatically becomes In Shop. Close maintenance to restore availability. |
| **Fuel & Expenses** | Record fuel logs (liters, cost, date) and other expenses (tolls, repairs). View total operational cost per vehicle. |
| **Reports & Analytics** | Charts for Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI. CSV export (PDF optional). |

---

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```  
---  

## Environment Variables  

Create a `.env` file in the root of the frontend:  

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1
```  
--- 

## Available Scripts

| **Command** | **Description** |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

---  

## Deployment

The frontend is deployed on Vercel. The production build is created using:

```bash
npm run build
```  

