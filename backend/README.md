# Backend – Oddo Hackathon 2026

This is the Node.js + Express backend for the Hackathon project. It follows a **modular architecture** where each feature (e.g., `auth`, `users`) is isolated, and common utilities are shared across modules.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **File Uploads**: Multer + Cloudinary (optional)
- **Logging**: Morgan
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

---

## Folder Structure
## Folder Structure

```
backend/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── cloudnary.js
│   │   └── database.js
│   ├── module/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.utils.js
│   │   └── users/
│   ├── routes/
│   │   └── index.routes.js
│   ├── shared/
│   ├── constant/
│   │   ├── http-codes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── rate-limit.middleware.js
│   │   │   └── upload-middlware.js
│   │   └── utils/
│   │       ├── api-response.js
│   │       └── app-error.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
└── package.json
```