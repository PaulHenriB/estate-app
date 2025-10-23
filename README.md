# Dwelli - AI-Powered Real Estate Assistant

Dwelli is a full-stack, AI-powered real estate assistant designed to help users in Dublin, Ireland, find and apply for properties faster. It streamlines the search process with personalized discovery, automated tenant profiling, and seamless document management.

## Tech Stack

-   **Frontend:** React (TypeScript) + TailwindCSS + React Router
-   **Backend:** Node.js + Express + TypeScript
-   **Database:** PostgreSQL + Prisma ORM
-   **Authentication:** JSON Web Tokens (JWT)
-   **AI Layer:** Google Gemini API
-   **File Storage:** Local file system (for demo purposes; swappable with AWS S3/Supabase Storage)

---

## Folder Structure

```
/dwelli
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed script for initial data
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Express middlewares (auth, errors)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic (Gemini, DB)
│   │   └── utils/          # Utility functions (JWT, validation)
│   ├── server.ts           # Main server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── App.tsx
│   └── index.tsx
├── shared/
│   └── types.ts            # Shared types between frontend and backend
├── docker-compose.yml      # Docker setup for PostgreSQL
├── .env.example            # Environment variable template
└── README.md
```

---

## Local Setup & Installation

**Prerequisites:**
*   Node.js (v18+)
*   npm or yarn
*   Docker and Docker Compose

**1. Clone the repository and install dependencies:**

```bash
# Project is already set up in this environment.
# In a real environment, you would run:
# git clone <repository_url>
# cd dwelli
```

**2. Set up Backend Dependencies:**

```bash
cd backend
npm install
cd ..
```

**3. Set up Environment Variables:**

Create a `.env` file in the `backend/` directory by copying the example file.

```bash
cp backend/.env.example backend/.env
```

Now, fill in the `backend/.env` file with your credentials:
-   `DATABASE_URL`: The connection string for your PostgreSQL database. The `docker-compose.yml` sets this up for you.
-   `JWT_SECRET`: A long, random, secret string for signing JWTs.
-   `API_KEY`: Your Google Gemini API key.

**4. Start the Database:**

Run the PostgreSQL database instance using Docker Compose.

```bash
docker-compose up -d
```

**5. Run Database Migrations & Seeding:**

This will set up your database schema and populate it with initial data (mock listings, admin user, etc.).

```bash
cd backend
npx prisma migrate dev
npx prisma db seed
cd ..
```

**6. Start the Servers:**

The frontend and backend run concurrently.

```bash
# Start the backend server (on port 3001)
cd backend
npm run dev

# The frontend dev server is already running in this environment.
```

You can now access the application in your browser.

-   **Frontend:** `http://localhost:5173` (or as specified by the dev server)
-   **Backend API:** `http://localhost:3001`

---

## Available Scripts

### Backend (`/backend`)

-   `npm run dev`: Starts the backend server with hot-reloading.
-   `npm run build`: Compiles the TypeScript code to JavaScript.
-   `npm start`: Starts the compiled backend server.
-   `npm test`: Runs API tests using Jest.
-   `npx prisma migrate dev`: Applies database schema changes.
-   `npx prisma db seed`: Runs the database seed script.
-   `npx prisma studio`: Opens the Prisma Studio GUI to view/edit data.

---

## API Documentation

API documentation can be generated using Swagger/OpenAPI. The basic setup is included. To view the documentation, start the backend server and navigate to `/api-docs`.

---

## Filter Optimization Table

This table maps the user-facing filters to their corresponding Prisma schema fields.

| Filter                 | Type     | DB Field (`Listing`) | UI Element      | Example Value           |
| ---------------------- | -------- | -------------------- | --------------- | ----------------------- |
| Location               | String   | `address`            | Text Input      | “Dublin 2”              |
| Property Type          | Enum     | `type`               | Dropdown        | `APARTMENT`             |
| Max Price              | Int      | `price`              | Slider          | `2500`                  |
| Min Bedrooms           | Int      | `bedrooms`           | Dropdown        | `2`                     |
| Furnishing             | Boolean  | `furnished`          | Dropdown        | `true`                  |

---

## Deployment Guide

### Frontend (Vercel)

1.  Connect your Git repository to Vercel.
2.  Set the framework preset to "Vite" or "Create React App".
3.  Set the root directory to `frontend`.
4.  Add an environment variable `VITE_API_URL` and point it to your deployed backend URL (e.g., `https://your-dwelli-backend.onrender.com`).
5.  Deploy.

### Backend (Render)

1.  Create a new "Web Service" on Render and connect your Git repository.
2.  Set the root directory to `backend`.
3.  Set the Build Command to `npm install && npx prisma generate && npm run build`.
4.  Set the Start Command to `npm start`.
5.  Create a PostgreSQL instance on Render.
6.  Add your environment variables (`DATABASE_URL`, `JWT_SECRET`, `API_KEY`) in the Render dashboard. Use the internal database connection string provided by Render for `DATABASE_URL`.
7.  Deploy. After the first deploy, you may need to SSH into the instance to run `npx prisma migrate deploy`.
