# TransitOps – Backend

**Smart Transport Operations Platform** – Backend API built with Node.js, Express, and MongoDB.

> This is the backend for the **TransitOps** hackathon project. It manages the complete lifecycle of transport operations: vehicles, drivers, trips, maintenance, fuel/expenses, and analytics.

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator (planned)
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

---

## Folder Structure
```text
backend/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── cloudinary.js       # optional – for document uploads
│   │   └── database.js         # MongoDB connection
│   ├── module/                 # Feature modules (domain-driven)
│   │   ├── auth/               # Authentication & RBAC
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.utils.js
│   │   ├── users/              # User management (admins, fleet managers, etc.)
│   │   │   ├── user.controller.js
│   │   │   ├── user.routes.js
│   │   │   ├── user.service.js
│   │   │   └── user.model.js
│   │   ├── vehicles/           # Vehicle registry & lifecycle
│   │   │   ├── vehicle.controller.js
│   │   │   ├── vehicle.routes.js
│   │   │   ├── vehicle.service.js
│   │   │   └── vehicle.model.js
│   │   ├── drivers/            # Driver profiles & status
│   │   │   ├── driver.controller.js
│   │   │   ├── driver.routes.js
│   │   │   ├── driver.service.js
│   │   │   └── driver.model.js
│   │   ├── trips/              # Trip creation, dispatch, completion
│   │   │   ├── trip.controller.js
│   │   │   ├── trip.routes.js
│   │   │   ├── trip.service.js
│   │   │   └── trip.model.js
│   │   ├── maintenance/        # Maintenance logs & status changes
│   │   │   ├── maintenance.controller.js
│   │   │   ├── maintenance.routes.js
│   │   │   ├── maintenance.service.js
│   │   │   └── maintenance.model.js
│   │   ├── fuel-expenses/      # Fuel logs & other expenses
│   │   │   ├── fuel.controller.js
│   │   │   ├── fuel.routes.js
│   │   │   ├── fuel.service.js
│   │   │   └── fuel.model.js
│   │   └── reports/            # Analytics & aggregated data
│   │       ├── reports.controller.js
│   │       ├── reports.routes.js
│   │       └── reports.service.js
│   ├── routes/
│   │   └── index.routes.js     # Aggregates all feature routes
│   ├── shared/
│   │   ├── constants/
│   │   │   └── http-codes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── rate-limit.middleware.js
│   │   │   └── upload.middleware.js
│   │   └── utils/
│   │       ├── api-response.js
│   │       └── app-error.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```  

### Key Modules

| Module | Purpose |
|--------|---------|
| **auth** | Login, registration, JWT generation, role-based access control (RBAC). |
| **users** | Manage user profiles, roles (Fleet Manager, Driver, Safety Officer, Financial Analyst). |
| **vehicles** | CRUD operations for vehicles; status transitions (Available, On Trip, In Shop, Retired). Enforces unique registration number and business rules. |
| **drivers** | Driver profiles with license validity, safety score, status (Available, On Trip, Off Duty, Suspended). |
| **trips** | Create, update, dispatch, complete, cancel trips. Enforces all business rules (capacity, availability, license expiry, etc.) and auto‑updates vehicle/driver status. |
| **maintenance** | Log maintenance records; automatically sets vehicle status to **In Shop** and removes it from dispatch pool. Closing maintenance restores status. |
| **fuel-expenses** | Record fuel logs (liters, cost, date) and other expenses (tolls, repairs). Computes operational costs per vehicle. |
| **reports** | Aggregates KPIs: Fuel Efficiency, Fleet Utilization, Operational Cost, Vehicle ROI. Supports CSV export (and optional PDF). |

---

## Business Rules (Enforced at Service Level)

- Vehicle registration number **must be unique**.
- **Retired** or **In Shop** vehicles cannot appear in trip dispatch selection.
- Drivers with **expired license** or **Suspended** status cannot be assigned to trips.
- A driver or vehicle already **On Trip** cannot be assigned to another trip.
- **Cargo weight** must not exceed vehicle's max load capacity.
- Dispatching a trip → vehicle & driver status → **On Trip**.
- Completing a trip → vehicle & driver status → **Available**.
- Cancelling a dispatched trip → restores vehicle & driver to **Available**.
- Creating a maintenance record → vehicle status → **In Shop** (if not already retired).
- Closing maintenance → vehicle status → **Available** (unless retired).

---

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev
```  

### Environment Variables (`.env.example`) 

```text
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/transitops

# JWT
JWT_SECRET=your_super_secret_key

# Cloudinary (optional, for document uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```  

## API Endpoints Overview

| Resource | Endpoint | Description |
|----------|----------|-------------|
| Auth | `/api/auth/login`, `/api/auth/register` | Login & registration |
| Users | `/api/users` | Manage users (admin only) |
| Vehicles | `/api/vehicles` | CRUD, status updates |
| Drivers | `/api/drivers` | CRUD, license validation |
| Trips | `/api/trips` | Create, dispatch, complete, cancel |
| Maintenance | `/api/maintenance` | Create, close maintenance records |
| Fuel/Expenses | `/api/fuel` | Log fuel and other expenses |
| Reports | `/api/reports` | Dashboard KPIs, CSV export |

> **Note**: All endpoints (except login/register) are protected by JWT and RBAC.  
