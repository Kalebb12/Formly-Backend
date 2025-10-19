# Formly — Simple Form Builder 🚀

Formly is a backend for a simple form-builder app where users can create and share custom forms (contact, survey, feedback, etc.) and collect responses in their dashboard. This repository contains the API and auth logic for the MVP.


## MVP Concept
Users create and share forms and collect submissions. The backend supports:
- User authentication (signup/login)
- Public form URLs
- Viewing and downloading submissions
- Paid plan integration (Stripe) placeholder

## Core MVP features
- ✅ User authentication (signup, login, logout)
- ✅ Dashboard: create, edit, and delete forms (API scaffolding may be partial)
- ✅ Public form URLs (e.g., `formly.app/f/caleb-contact`)
- ✅ View and download submissions (may require additional work)
- ✅ Paid plan → unlock more forms, analytics, and branding (Stripe referenced)

## Tech stack
- Node.js (ES Modules)
- Express
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) in httpOnly cookies
- Stripe (dependency installed, integration not fully wired)

## Project structure (high level)
- `index.js` — server bootstrap (starts the app)
- `src/app.js` — Express app and middleware
- `src/config/db.js` — MongoDB connection helper
- `src/models` — Mongoose models (User, forms, submissions — some may be missing)
- `src/controllers` — API controllers (auth implemented)
- `src/routes` — Routes (auth route present)
- `src/middleware` — auth middleware (protect.js)

## Prerequisites
- Node.js 18+ (or modern Node supporting ESM)
- MongoDB (connection URI)
- (Optional) Stripe account for payments

## Required environment variables
- `MONGO_URI` — MongoDB connection string (required)
- `JWT_SECRET` — secret to sign JWT tokens (required)
- `NODE_ENV` — `development` or `production` (optional)
- `PORT` — server port (optional; default 5000)
- `STRIPE_SECRET_KEY` — Your stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Your stripe webhook secret

## Install
From the project root:

```powershell
npm install