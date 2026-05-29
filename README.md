# Portfolio Platform

Full-stack developer portfolio platform with:

- A React + Vite frontend for the public portfolio and `/admin` dashboard
- A Node.js + Express API backend
- MongoDB for metadata, projects, and contact inquiries

## Project Structure

```text
portfolio/
├─ client/                 # React frontend (public site + admin UI)
├─ server/                 # Express API + MongoDB models
├─ package.json            # Root scripts to run both apps
├─ install.json            # Pinokio install workflow
├─ start.json              # Pinokio start workflow
└─ pinokio.json            # Pinokio launcher config
```

## Tech Stack

### Frontend

- React 19
- Vite 8
- Framer Motion + GSAP
- React Router
- Theatre.js
- Three.js / React Three Fiber

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (access + refresh tokens in cookies)
- Multer + pdf-parse for resume uploads

## Features

- Public portfolio sections (hero, capabilities, projects, gallery, philosophy, contact)
- Dynamic metadata loading from backend with frontend fallback data
- Contact form submission and inquiry management
- Project CRUD endpoints with admin protection
- Admin dashboard for:
  - authentication and session verification
  - metadata updates
  - inquiry read/delete actions
  - project create/delete actions
  - admin password updates
- Resume download from backend static assets (`/public/RAHUL_Resume.pdf`)

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB running locally or reachable via connection string

## Installation

From the repository root:

```bash
npm install
```

This installs root dependencies and automatically installs dependencies in `client/` and `server/`.

## Environment Variables

Create a `.env` file in `/tmp/workspace/RAHUL-0568/portfolio/server`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_db
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
RECOVERY_KEY=your_recovery_key
NODE_ENV=development
```

Notes:

- If no admin exists, the server seeds one using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `RECOVERY_KEY` must be set for auth flows.

## Running the App

From root:

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

You can also run each part separately:

```bash
npm run client
npm run server
```

## Available Scripts

### Root (`/tmp/workspace/RAHUL-0568/portfolio`)

- `npm run dev` - run frontend and backend together
- `npm run client` - run frontend dev server
- `npm run server` - run backend in watch mode

### Frontend (`/tmp/workspace/RAHUL-0568/portfolio/client`)

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

### Backend (`/tmp/workspace/RAHUL-0568/portfolio/server`)

- `npm test` - placeholder script (currently exits with error)

## API Overview

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/verify` (protected)
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/recover`
- `POST /auth/update-password`

### Projects

- `GET /projects`
- `GET /projects/featured`
- `POST /projects` (protected)
- `PUT /projects/:id` (protected)
- `DELETE /projects/:id` (protected)

### Contact

- `POST /contact`
- `GET /contact/inquiries` (protected)
- `PUT /contact/inquiries/:id` (protected)
- `DELETE /contact/inquiries/:id` (protected)

### Resume / Metadata

- `GET /resume/metadata`
- `PUT /resume/metadata` (protected)
- `POST /resume/upload` (protected, multipart form field: `resume`)

## Admin Access

- Open `http://localhost:5173/admin`
- Log in with your configured admin credentials
- Session cookies (`token`, `refreshToken`) are used for authenticated actions

## Deployment Notes

- In production, the backend serves the frontend build from `client/dist`
- Resume and static assets are served from `server/public` under `/public`

## Current Validation Status

Commands run in this repository:

- `npm run --prefix client lint` -> fails with existing lint issues in current codebase
- `npm run --prefix client build` -> succeeds
- `npm test --prefix server` -> fails intentionally because test script is a placeholder
