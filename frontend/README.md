# TransitOps – Frontend

**Smart Transport Operations Platform** – React frontend built with Vite.

> This is the frontend for the **TransitOps** hackathon project. It provides a responsive dashboard, CRUD interfaces for vehicles/drivers/trips, maintenance workflow, fuel/expense logging, and analytics reports.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context (Auth, Theme)
- **Styling**: CSS / Tailwind (optional)
- **Charts**: Chart.js or Recharts (for reports)
- **Environment**: dotenv (VITE_ prefix)

---

## Folder Structure

```
frontend/
├── node_modules/
├── public/                # static assets
├── src/
│   ├── api/               # Axios client and API endpoints
│   │   ├── client.js
│   │   ├── authApi.js
│   │   ├── vehiclesApi.js
│   │   ├── driversApi.js
│   │   ├── tripsApi.js
│   │   ├── maintenanceApi.js
│   │   ├── fuelApi.js
│   │   └── reportsApi.js
│   ├── assets/            # images, fonts
│   ├── components/        # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Layout/
│   │   ├── DataTable/
│   │   ├── StatusBadge/
│   │   └── Charts/
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   └── useFetch.js
│   ├── pages/             # Page-level components
│   │   ├── Dashboard.jsx          # KPIs, filters, charts
│   │   ├── Vehicles/              # Vehicle list, create, edit
│   │   │   ├── VehicleList.jsx
│   │   │   ├── VehicleForm.jsx
│   │   │   └── VehicleDetails.jsx
│   │   ├── Drivers/               # Driver list, create, edit
│   │   │   ├── DriverList.jsx
│   │   │   └── DriverForm.jsx
│   │   ├── Trips/                 # Trip creation, dispatch, status
│   │   │   ├── TripList.jsx
│   │   │   ├── TripForm.jsx
│   │   │   └── TripDetails.jsx
│   │   ├── Maintenance/           # Maintenance logs
│   │   │   ├── MaintenanceList.jsx
│   │   │   └── MaintenanceForm.jsx
│   │   ├── FuelExpenses/          # Fuel and expense logging
│   │   │   ├── FuelLogList.jsx
│   │   │   └── FuelLogForm.jsx
│   │   ├── Reports/               # Analytics and exports
│   │   │   ├── ReportsDashboard.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/             # Helpers
│   │   ├── validators.js
│   │   └── formatDate.js
│   ├── App.css
│   ├── App.jsx            # Routes and main layout
│   ├── index.css
│   ├── main.jsx
│   ├── .env
│   └── .env.example
├── .gitignore
├── .env.example           # (duplicate if needed)
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Pages & Features

| Page | Description |
|------|-------------|
| **Login / Register** | Authentication with role-based access (Fleet Manager, Driver, Safety Officer, Financial Analyst). |
| **Dashboard** | Displays KPIs: Active Vehicles, Available Vehicles, In Maintenance, Active Trips, Pending Trips, Drivers On Duty, Fleet Utilization (%). Filter by vehicle type/status/region. |
| **Vehicles** | Full CRUD; list, add, edit, retire vehicles. Status badges (Available, On Trip, In Shop, Retired). |
| **Drivers** | Full CRUD; manage driver profiles, license validity, safety score, status. |
| **Trips** | Create trips with source, destination, vehicle/driver selection (enforces business rules), cargo weight validation. Lifecycle: Draft → Dispatched → Completed → Cancelled. Auto‑updates vehicle/driver statuses. |
| **Maintenance** | Log maintenance records; vehicle status automatically becomes In Shop. Close maintenance to restore availability. |
| **Fuel & Expenses** | Record fuel logs (liters, cost, date) and other expenses (tolls, repairs). View total operational cost per vehicle. |
| **Reports & Analytics** | Charts for Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI. CSV export (PDF optional). |

---

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # fill in API URL
npm run dev
```  

### Environment Variables (`.env.example`)
```text
VITE_API_URL=http://localhost:5000/api
```  
---  

### Vite Proxy (to avoid CORS)  

`vite.config.js` includes a proxy for `/api` to the backend:  

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```  
> Now we can call `axios.get('/api/vehicles')` and it will be forwarded to the `backend`.   

---  

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |