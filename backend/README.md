# TransitOps – Backend

Smart Transport Operations Platform – Backend API built with Node.js, Express, and MongoDB.

This is the backend for the TransitOps hackathon project. It manages the complete lifecycle of transport operations: vehicles, drivers, trips, maintenance, fuel/expenses, and analytics.

---

## Live Demo

**Deployed API:** [https://oddo-hackathon-2026-nvab.vercel.app/](https://oddo-hackathon-2026-nvab.vercel.app/)

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + bcryptjs (httpOnly cookies)
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

---

## Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── cloudnary.js # optional – for document uploads
│   │   └── database.js # MongoDB connection
│   ├── module/ # Feature modules (domain-driven)
│   │   ├── auth/ # Authentication & RBAC
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.utils.js
│   │   │   └── auth.validation.js
│   │   ├── users/ # User Model
│   │   │   ├── users.models.js
│   │   ├── vehicles/ # Vehicle registry & lifecycle
│   │   │   ├── vehicle.controller.js
│   │   │   ├── vehicle.model.js
│   │   │   ├── vehicle.routes.js
│   │   │   ├── vehicle.service.js
│   │   │   └── vehicle.validation.js
│   │   ├── drivers/ # Driver profiles & status
│   │   │   ├── driver.controller.js
│   │   │   ├── driver.model.js
│   │   │   ├── driver.routes.js
│   │   │   ├── driver.service.js
│   │   │   └── driver.validation.js
│   │   ├── trips/ # Trip creation, dispatch, completion
│   │   │   ├── trip.controller.js
│   │   │   ├── trip.model.js
│   │   │   ├── trip.routes.js
│   │   │   ├── trip.service.js
│   │   │   └── trip.validation.js
│   │   ├── maintenance/ # Maintenance logs & status changes
│   │   │   ├── maintenance.controller.js
│   │   │   ├── maintenance.model.js
│   │   │   ├── maintenance.routes.js
│   │   │   ├── maintenance.service.js
│   │   │   └── maintenance.validation.js
│   │   ├── fuel-expenses/ # Fuel logs & other expenses
│   │   │   ├── expense.model.js
│   │   │   ├── fuel-expense.controller.js
│   │   │   ├── fuel-expense.routes.js
│   │   │   ├── fuel-expense.service.js
│   │   │   ├── fuel-expense.validation.js
│   │   │   └── fuel.model.js
│   │   └── reports/ # Analytics & aggregated data
│   │       ├── reports.controller.js
│   │       ├── reports.routes.js
│   │       ├── reports.service.js
│   │       └── reports.validation.js
│   ├── routes/
│   │   └── index.routes.js # Aggregates all feature routes
│   ├── shared/
│   │   ├── constant/
│   │   │   └── http-codes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── not-found.middleware.js
│   │   │   ├── rate-limit.middleware.js
│   │   │   ├── upload-middleware.js
│   │   │   └── validation.middleware.js
│   │   └── utils/
│   │       ├── api-response.js
│   │       └── app-error.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```  


---

## Key Modules

| Module | Purpose |
|--------|---------|
| **auth** | Login, registration, JWT generation, role-based access control (RBAC). |
| **users** | Manage user profiles, roles (Fleet Manager, Driver, Safety Officer, Financial Analyst). |
| **vehicles** | CRUD operations for vehicles; status transitions (Available, On Trip, In Shop, Retired). Enforces unique registration number and business rules. |
| **drivers** | Driver profiles with license validity, safety score, status (Available, On Trip, Off Duty, Suspended). |
| **trips** | Create, update, dispatch, complete, cancel trips. Enforces all business rules (capacity, availability, license expiry, etc.) and auto-updates vehicle/driver status. |
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
- Dispatching a trip -> vehicle & driver status -> **On Trip**.
- Completing a trip -> vehicle & driver status -> **Available**.
- Cancelling a dispatched trip -> restores vehicle & driver to **Available**.
- Creating a maintenance record -> vehicle status -> **In Shop** (if not already retired).
- Closing maintenance -> vehicle status -> **Available** (unless retired).

---

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev
```  
### Environment Variables  

> Create a `.env` file in the root of the backend:  

```text
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/transitops

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Cloudinary (optional, for document uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```  

---  

## API Endpoints Overview

| **Resource** | **Endpoint** | **Description** |
|----------|----------|-------------|
| Auth | `/api/auth/login`, `/api/auth/register` | Login & registration |
| Users | `/api/users` | Manage users (admin only) |
| Vehicles | `/api/vehicles` | CRUD, status updates |
| Drivers | `/api/drivers` | CRUD, license validation |
| Trips | `/api/trips` | Create, dispatch, complete, cancel |
| Maintenance | `/api/maintenance` | Create, close maintenance records |
| Fuel/Expenses | `/api/fuel-expenses/fuel`, `/api/fuel-expenses/expenses` | Log fuel and other expenses |
| Reports | `/api/reports/dashboard`, `/api/reports/analytics` | Dashboard KPIs, CSV export |

> **Note:** All endpoints (except login/register) are protected by JWT and RBAC.  

---  

## Available Scripts

| **Command** | **Description** |
|---------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm start` | Start production server |

## Deployment

The backend can be deployed on platforms like Render, Heroku, or AWS. Ensure the following:

- Set `NODE_ENV=production`
- Configure `MONGODB_URI` with your production database
- Set `CLIENT_URL` to your frontend deployment URL for CORS
- Use environment variables for all sensitive data