# TaskFlow — Real-Time Collaborative Task Manager

![TaskFlow Banner](https://img.shields.io/badge/TaskFlow-Collaborative%20Task%20Manager-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socket.io)

A full-stack, real-time collaborative task management application built with React, Node.js, PostgreSQL, and Clerk authentication. Users can create, manage, and assign tasks to teammates — with live updates via WebSockets.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Real-Time Architecture](#real-time-architecture)
- [Deployment](#deployment)
- [Development Progress](#development-progress)

---

## Features

### Core Features
- **Google Authentication** — Secure sign-in via Clerk with Google OAuth
- **Personal Task Management** — Create, edit, delete, and mark tasks as complete
- **Task Assignment** — Assign tasks to other users by email address
- **Pending Assignments** — If assignee hasn't signed up yet, task is automatically linked when they join
- **Real-Time Updates** — Live UI updates via Socket.io when tasks are assigned or modified

### UI/UX
- **Premium Dark UI** — Built with Tailwind CSS and a custom brand color palette
- **Smooth Animations** — Framer Motion for page transitions, modals, and task card animations
- **Loading Skeletons** — Skeleton loaders while data is fetching
- **Toast Notifications** — Success and error feedback for every action
- **Responsive Design** — Works on Desktop, Tablet, and Mobile
- **Status Filters** — Filter tasks by All / To Do / In Progress / Done
- **Stats Dashboard** — Overview of total, in-progress, and completed tasks
- **Overdue Indicators** — Visual indicators for tasks past their due date

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS v3 | Styling |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state management + caching |
| Axios | HTTP client |
| Socket.io Client | Real-time WebSocket connection |
| Clerk (@clerk/react) | Authentication UI + session management |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Server runtime |
| Express.js | HTTP framework |
| Prisma v5 | ORM + database client |
| PostgreSQL (Neon) | Database |
| Socket.io | Real-time WebSocket server |
| Clerk (@clerk/express) | JWT verification |
| Svix | Clerk webhook signature verification |
| dotenv | Environment variable management |
| Nodemon + ts-node | Development hot reload |

### Infrastructure
| Service | Purpose |
|---|---|
| Clerk | Authentication + user management |
| Neon | Serverless PostgreSQL database |
| Vercel | Frontend deployment |
| Railway | Backend deployment |
| GitHub | Version control |
| ngrok | Local webhook testing |

---

## Project Structure

```
collaborative-task-manager/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Modal.tsx        # Reusable modal with Framer Motion
│   │   │   │   └── Badge.tsx        # Task status badge
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.tsx     # Individual task card with actions
│   │   │   │   └── TaskForm.tsx     # Create/edit task form
│   │   │   ├── layout/              # Navbar, PageWrapper (coming soon)
│   │   │   └── skeletons/
│   │   │       └── TaskSkeleton.tsx # Loading skeleton
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx        # Google auth login page
│   │   │   └── DashboardPage.tsx    # Main task dashboard
│   │   ├── hooks/
│   │   │   ├── useTasks.ts          # React Query hooks for task CRUD
│   │   │   └── useSocket.ts         # Socket.io real-time hook
│   │   ├── lib/
│   │   │   ├── api.ts               # Axios instance + task API calls
│   │   │   ├── socket.ts            # Socket.io client setup
│   │   │   └── queryClient.ts       # React Query client config
│   │   ├── types/
│   │   │   └── index.ts             # Shared TypeScript types
│   │   ├── App.tsx                  # Routes + protected route logic
│   │   ├── main.tsx                 # App entry point + providers
│   │   └── index.css                # Global styles + Tailwind
│   ├── .env.local                   # Frontend env variables (git ignored)
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── tasks.ts             # Task CRUD routes
│   │   │   └── webhooks.ts          # Clerk webhook route
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification middleware
│   │   │   └── errorHandler.ts      # Central error handler
│   │   ├── controllers/
│   │   │   ├── taskController.ts    # Task business logic
│   │   │   └── webhookController.ts # Clerk user sync logic
│   │   ├── lib/
│   │   │   ├── prisma.ts            # Prisma client singleton
│   │   │   └── socket.ts            # Socket.io server setup
│   │   └── index.ts                 # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── .env                         # Backend env variables (git ignored)
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                     # Root workspace config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Git
- A [Clerk](https://clerk.com) account
- A [Neon](https://neon.tech) account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/collaborative-task-manager.git
cd collaborative-task-manager
git checkout dev
```

### 2. Install dependencies

**Root:**
```bash
npm install
```

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### 3. Set up environment variables

See the [Environment Variables](#environment-variables) section below.

### 4. Set up the database

Tables are managed via Neon. Run this SQL in the Neon SQL Editor:

```sql
CREATE TYPE "Status" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "clerkId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tasks" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "Status" NOT NULL DEFAULT 'TODO',
  "dueDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ownerId" TEXT NOT NULL,
  "assigneeId" TEXT,
  "pendingAssigneeEmail" TEXT,
  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey"
  FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

Then generate Prisma client:
```bash
cd server
npx prisma generate
```

### 5. Run the development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 — ngrok (for webhooks):**
```bash
ngrok http 5000
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

### `client/.env.local`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

| Variable | Description | Where to get |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Clerk Dashboard → API Keys |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` for local dev |

### `server/.env`
```env
DATABASE_URL=postgresql://postgres:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxx
CLIENT_URL=http://localhost:5173
PORT=5000
```

| Variable | Description | Where to get |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (port 6543) | Neon Dashboard → Connect → Connection pooling ON |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret | Clerk Dashboard → Webhooks → your endpoint |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` for local dev |
| `PORT` | Server port | `5000` |

---

## API Reference

All routes except `/health` and `/webhooks/clerk` require a valid Clerk JWT in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Health Check
```
GET /health
```
Returns `{ "status": "ok" }`

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Get all tasks (owned + assigned) |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update a task (owner only) |
| `DELETE` | `/tasks/:id` | Delete a task (owner only) |

#### POST /tasks — Request Body
```json
{
  "title": "Fix login bug",
  "description": "Optional description",
  "dueDate": "2026-04-01",
  "assigneeEmail": "teammate@example.com"
}
```

#### PATCH /tasks/:id — Request Body
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "dueDate": "2026-04-15"
}
```

### Webhooks
```
POST /webhooks/clerk
```
Handles Clerk `user.created` events. Saves new users to DB and resolves pending task assignments.

---

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  clerkId   String   @unique
  email     String   @unique
  name      String
  avatarUrl String?
  createdAt DateTime @default(now())

  ownedTasks    Task[] @relation("TaskOwner")
  assignedTasks Task[] @relation("TaskAssignee")
}

model Task {
  id                   String    @id @default(uuid())
  title                String
  description          String?
  status               Status    @default(TODO)
  dueDate              DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  ownerId              String
  assigneeId           String?
  pendingAssigneeEmail String?

  owner    User  @relation("TaskOwner")
  assignee User? @relation("TaskAssignee")
}

enum Status {
  TODO
  IN_PROGRESS
  DONE
}
```

---

## Authentication Flow

```
1. User clicks "Sign in with Google"
         ↓
2. Clerk handles Google OAuth
         ↓
3. Clerk issues a JWT session token
         ↓
4. Frontend attaches JWT to every API request
   Authorization: Bearer <token>
         ↓
5. Backend verifyToken() validates the JWT
         ↓
6. req.userId is set to the Clerk user ID
         ↓
7. Controllers use clerkId to find the user in DB
```

### New User Registration (Webhook Flow)
```
1. New user signs up via Google
         ↓
2. Clerk fires user.created webhook
         ↓
3. Backend verifies webhook signature (svix)
         ↓
4. User is saved to PostgreSQL (users table)
         ↓
5. Any pending task assignments for their email
   are automatically resolved
```

---

## Real-Time Architecture

```
Client connects to Socket.io server
         ↓
Client emits "join" with their DB user ID
         ↓
Server adds socket to a personal room (userId)
         ↓
When a task event occurs on the backend:
  - task:assigned → emits to assignee's room
  - task:updated  → emits to owner + assignee rooms
  - task:deleted  → emits to owner + assignee rooms
         ↓
Client receives event → React Query invalidates
['tasks'] cache → UI refetches and updates instantly
```

### Socket Events

| Event | Direction | Payload |
|---|---|---|
| `join` | Client → Server | `userId: string` |
| `task:assigned` | Server → Client | `Task` object |
| `task:updated` | Server → Client | `Task` object |
| `task:deleted` | Server → Client | `{ id: string }` |

---

## Deployment

### Frontend — Vercel
1. Push code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Add environment variables in Vercel dashboard
5. Deploy

### Backend — Railway
1. Connect repo to [Railway](https://railway.app)
2. Set root directory to `server`
3. Add environment variables in Railway dashboard
4. Set start command: `npm run start`
5. Deploy

### Post-Deployment
- Update `VITE_API_URL` in Vercel to your Railway backend URL
- Update `CLIENT_URL` in Railway to your Vercel frontend URL
- Update Clerk webhook URL to your Railway backend URL
- Update Clerk allowed origins with your Vercel URL

---

## Development Progress

| Phase | Feature | Status |
|---|---|---|
| Phase 1 | Project scaffolding | ✅ Complete |
| Phase 1 | Vite + React + TypeScript setup | ✅ Complete |
| Phase 1 | Tailwind CSS configuration | ✅ Complete |
| Phase 1 | Clerk Google authentication | ✅ Complete |
| Phase 1 | Login page UI | ✅ Complete |
| Phase 1 | Protected routes | ✅ Complete |
| Phase 2 | Express + TypeScript server | ✅ Complete |
| Phase 2 | Prisma v5 + Neon PostgreSQL | ✅ Complete |
| Phase 2 | Database schema + tables | ✅ Complete |
| Phase 2 | Auth middleware (JWT verification) | ✅ Complete |
| Phase 2 | Task CRUD API routes | ✅ Complete |
| Phase 2 | Socket.io real-time server | ✅ Complete |
| Phase 2 | Error handler middleware | ✅ Complete |
| Phase 3 | Task creation form + modal | ✅ Complete |
| Phase 3 | Task cards with edit/delete/complete | ✅ Complete |
| Phase 3 | Loading skeletons | ✅ Complete |
| Phase 3 | Toast notifications | ✅ Complete |
| Phase 3 | Status filters | ✅ Complete |
| Phase 3 | Stats dashboard | ✅ Complete |
| Phase 3 | Responsive design | ✅ Complete |
| Phase 4 | Clerk webhook setup | ✅ Complete |
| Phase 4 | Auto user sync on signup | ✅ Complete |
| Phase 4 | Pending assignment resolution | ✅ Complete |
| Phase 4 | Auth token fix | 🔄 In Progress |
| Phase 5 | Deployment (Vercel + Railway) | ⏳ Pending |

---

## Contributing

This is a personal project built as part of a collaborative task manager implementation. Feel free to fork and extend.

---

## License

MIT License — free to use and modify.

---

> Built with ❤️ using React, Node.js, PostgreSQL, and Clerk