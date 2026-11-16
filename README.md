# Todo List App

A full-stack to-do list application with user authentication and task management. The project includes a React frontend and an Express backend connected to PostgreSQL with Sequelize ORM.

## Features

- User authentication
- Create, view, update, and delete to-do items
- Automated tests for backend and frontend flows, plus Playwright end-to-end coverage

## Tech Stack

Frontend:
- React
- Vite
- Redux Toolkit
- Ant Design

Backend:
- Node.js
- Express
- PostgreSQL
- Sequelize ORM

Testing:
- Vitest
- Playwright

## Project Structure

```text
.
├── frontend/              # React frontend application
│   ├── src/               # UI source code, Redux slices, API services, tests
│   ├── package.json       # Frontend scripts and dependencies
│   └── vite.config.ts     # Vite configuration
├── src/                   # Express backend and Sequelize models
│   ├── routes/            # Auth and list API routes
│   ├── model/             # User and to-do models
│   ├── migration/         # Sequelize migrations
│   ├── seeder/            # Seed data
│   ├── config/            # Database config for Sequelize CLI
│   ├── app.ts             # Express app setup
│   ├── server.ts          # Server bootstrap
│   └── database.ts        # DB connection helpers
├── test/                  # Backend API tests
├── e2e/                   # Playwright end-to-end tests
├── .env                   # Local environment variables
├── .sequelizerc           # Sequelize CLI paths
├── package.json           # Backend scripts and dependencies
├── playwright.config.ts   # Playwright configuration
├── vitest.config.ts       # Vitest configuration
├── README.md              # Project documentation
└── package-lock.json      # Lockfile
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ or newer
- PostgreSQL installed and running
- A database user with permission to create and manage databases

## Environment Setup

Create a `.env` file in the project root with the following values:

```env
# DATABASE
DB_NAME=todolist
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key

# ENVIRONMENT
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

## Installation

Install the backend dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd frontend
npm install
cd ..
```

Create the database and run migrations:

```bash
npm run db:create
npm run db:migrate
```

If needed, you can also seed the database:

```bash
npm run db:seed
```

## Running the App

Start the backend server:

```bash
npm run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Then open the app in your browser at:

```text
http://localhost:5173
```

The backend API runs on:

```text
http://localhost:5000
```

## Production Build

Build the frontend bundle for production:

```bash
cd frontend
npm run build
```

Then start the backend server in production mode:

```bash
npm start
```

The server serves the built frontend from `frontend/dist` automatically.

## API Overview

Authentication routes:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and create a session cookie
- `POST /api/auth/logout` - Clear the session cookie

To-do list routes:

- `POST /api/list` - Create a new task
- `GET /api/list` - Get all tasks for the logged-in user
- `GET /api/list/:id` - Get one task by ID
- `PUT /api/list/:id` - Update a task
- `DELETE /api/list/:id` - Delete a task

## Testing

Run backend tests:

```bash
npm run test:run
```

Run frontend tests:

```bash
cd frontend
npm run test:run
```

Run end-to-end tests:

```bash
npm run test:e2e
```