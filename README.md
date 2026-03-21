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
- [How It Works](#how-it-works)
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
| Clerk (@clerk/backend) | JWT verification |
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

## How It Works

### User Roles

Every user in TaskFlow can play two roles simultaneously:

| Role | Description |
|---|---|
| **Owner** | The person who created the task |
| **Assignee** | The person a task has been assigned to |

A user can be an owner of some tasks and an assignee of others at the same time. Both types of tasks appear on their dashboard.

---

### Task Lifecycle

Every task moves through three statuses:

```
TODO ──────► IN_PROGRESS ──────► DONE
  ▲                                │
  └────────────────────────────────┘
         (can be reopened by owner)
```

---

### Owner Capabilities

The owner is the person who created the task. They have full control.

#### What an Owner Can Do

| Action | Description |
|---|---|
| **Create task** | Add title, description, due date, and optionally assign to someone |
| **Edit task** | Change title, description, and due date via edit modal |
| **Delete task** | Permanently remove the task |
| **Assign task** | Enter an email address to assign to another user |
| **Reopen task** | Click the green checkmark on a DONE task to set it back to TODO |
| **View status** | See a readonly status icon showing current progress on assigned tasks |

#### Owner UI on Task Card

- **Unassigned task** — sees a clickable circle to mark it complete directly
- **Assigned task** — sees a readonly status icon (assignee controls the status)
- **Edit/Delete buttons** — appear on hover, only visible to the owner
- **Reopen button** — green checkmark appears when task is DONE

#### Owner Restrictions

- Cannot change the status of an assigned task — the assignee controls that
- Cannot see edit/delete buttons on tasks they don't own

---

### Assignee Capabilities

The assignee is the person a task has been assigned to by the owner.

#### What an Assignee Can Do

| Action | Description |
|---|---|
| **Start task** | Click ▶️ Play button to move task from TODO → IN_PROGRESS |
| **Complete task** | Click ⭕ Circle button to move task from IN_PROGRESS → DONE |
| **View task details** | See title, description, due date, and owner info |

#### Assignee UI on Task Card

- **TODO status** — sees a ▶️ Play button — click to start working
- **IN_PROGRESS status** — sees a ⭕ Circle button — click to mark done
- **DONE status** — sees a ✅ green checkmark (readonly)
- **"Assigned to you"** label — shown in blue so the assignee can identify their tasks
- **No edit/delete buttons** — assignees cannot modify task details

#### Assignee Restrictions

- Cannot edit task title, description, or due date
- Cannot delete the task
- Cannot reopen a completed task (owner only)
- Cannot re-assign the task to someone else

---

### Permission Matrix

| Action | Owner | Assignee | Other Users |
|---|---|---|---|
| View task | ✅ | ✅ | ❌ |
| Edit title / description | ✅ | ❌ | ❌ |
| Edit due date | ✅ | ❌ | ❌ |
| Delete task | ✅ | ❌ | ❌ |
| Assign to someone | ✅ | ❌ | ❌ |
| Start task (TODO → IN_PROGRESS) | ❌ | ✅ | ❌ |
| Complete task (IN_PROGRESS → DONE) | ❌ | ✅ | ❌ |
| Reopen task (DONE → TODO) | ✅ | ❌ | ❌ |

---

### Task Assignment Flow

#### Assigning to an Existing User

```
Owner creates task → enters assignee email
         ↓
Backend checks if email exists in DB
         ↓
User found → task.assigneeId is set immediately
         ↓
Assignee sees task on their dashboard instantly
         ↓
Socket.io emits task:assigned to assignee's room
         ↓
Assignee's UI updates in real-time (no refresh needed)
```

#### Assigning to a Non-Existing User (Pending Assignment)

```
Owner creates task → enters email of someone not signed up yet
         ↓
Backend checks email → not found in DB
         ↓
task.pendingAssigneeEmail is stored
         ↓
Task card shows "(pending)" next to the email in amber
         ↓
Later, that person signs up with Google
         ↓
Clerk fires user.created webhook to backend
         ↓
Backend finds all tasks with that pendingAssigneeEmail
         ↓
Automatically sets assigneeId and clears pendingAssigneeEmail
         ↓
Task appears on new user's dashboard immediately
```

---

### Status Indicators on Task Cards

| Icon | Meaning | Clickable By |
|---|---|---|
| ⭕ Circle (grey) | Task is TODO | Owner (unassigned tasks only) |
| ▶️ Play Circle | Task is TODO, ready to start | Assignee |
| ⭕ Circle (purple) | Task is IN_PROGRESS | Assignee |
| ✅ Check Circle (green) | Task is DONE | Owner (to reopen) |
| 🔵 Readonly icon | Owner viewing an assigned task | Nobody |

---

### Overdue & Pending Indicators

- **Overdue** — if a task's due date has passed and status is not DONE, the date turns **red** and shows `· Overdue`
- **Pending** — if an assignee hasn't joined yet, their email shows in **amber** with `(pending)` next to it — resolves automatically on signup

---

## Project Structure

```
collaborative-task-manager/
│
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Modal, Badge
│   │   │   ├── tasks/               # TaskCard, TaskForm
│   │   │   ├── layout/              # Navbar, PageWrapper
│   │   │   └── skeletons/           # TaskSkeleton
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── hooks/                   # useTasks, useSocket, useCurrentUser
│   │   ├── lib/
│   │   │   ├── api.ts               # Axios instance + task/user API calls
│   │   │   ├── socket.ts            # Socket.io client setup
│   │   │   └── queryClient.ts       # React Query client config
│   │   ├── types/                   # Shared TypeScript types (Task, User)
│   │   ├── App.tsx                  # Routes + protected route logic
│   │   └── main.tsx                 # App entry point + providers
│   ├── .env.local                   # Frontend env variables (git ignored)
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── tasks.ts             # Task CRUD + /me route
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
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Git
- A [Clerk](https://clerk.com) account (free)
- A [Neon](https://neon.tech) account (free)
- A [ngrok](https://ngrok.com) account (free, for local webhook testing)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-task-manager.git
cd collaborative-task-manager
git checkout dev
```

### 2. Install Dependencies

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

### 3. Set Up Environment Variables

See the [Environment Variables](#environment-variables) section below. Create `client/.env.local` and `server/.env` before running.

### 4. Set Up the Database

Run this SQL in the **Neon SQL Editor** (Neon Dashboard → SQL Editor):

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

Then generate the Prisma client:
```bash
cd server
npx prisma generate
```

### 5. Run the Development Servers

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

**Terminal 3 — ngrok (for Clerk webhooks):**
```bash
ngrok http 5000
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** ISPs in India commonly block port 5432/6543. Use a **mobile hotspot** when running the server locally. After deploying to Railway, this is no longer needed.

---

## Environment Variables

### `client/.env.local`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

| Variable | Description | Where to Get |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Clerk Dashboard → API Keys |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` locally, Railway URL in production |

### `server/.env`
```env
DATABASE_URL=postgresql://postgres:password@ep-xxx.ap-southeast-1.aws.neon.tech:6543/neondb?sslmode=require
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxx
CLIENT_URL=http://localhost:5173
PORT=5000
```

| Variable | Description | Where to Get |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | Neon Dashboard → Connect → Connection pooling ON (port 6543) |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Webhook signing secret | Clerk Dashboard → Webhooks → your endpoint |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` locally, Vercel URL in production |
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

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/tasks` | Auth | Get all tasks (owned + assigned) |
| `GET` | `/tasks/me` | Auth | Get current user's DB id |
| `POST` | `/tasks` | Auth | Create a new task |
| `PATCH` | `/tasks/:id` | Owner / Assignee | Update a task |
| `DELETE` | `/tasks/:id` | Owner only | Delete a task |

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

> **Note:** Assignees can only update `status`. Owners can update all fields.

### Webhooks
```
POST /webhooks/clerk
```
Handles Clerk `user.created` events. Saves new users to the database and resolves any pending task assignments for their email address.

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

  @@map("users")
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      Status    @default(TODO)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  ownerId    String
  owner      User   @relation("TaskOwner", fields: [ownerId], references: [id], onDelete: Cascade)

  assigneeId String?
  assignee   User?  @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  pendingAssigneeEmail String?  # Stores email when assignee hasn't signed up yet

  @@map("tasks")
}

enum Status {
  TODO
  IN_PROGRESS
  DONE
}
```

---

## Authentication Flow

### Sign In Flow
```
1. User clicks "Sign in with Google"
         ↓
2. Clerk handles Google OAuth entirely
         ↓
3. Clerk issues a JWT session token to the frontend
         ↓
4. Frontend attaches JWT to every API request
   Authorization: Bearer <token>
         ↓
5. Backend verifyToken() validates the JWT on every request
         ↓
6. req.userId is set to the Clerk user ID
         ↓
7. Controllers use clerkId to look up the user in DB
```

### New User Registration (Webhook Flow)
```
1. New user signs up via Google for the first time
         ↓
2. Clerk fires user.created webhook to the backend
         ↓
3. Backend verifies the webhook signature using Svix
         ↓
4. User is saved to PostgreSQL (users table)
         ↓
5. Backend checks for any pending task assignments
   matching this user's email address
         ↓
6. Pending tasks are automatically linked to the new user
```

### Security
- All API routes require a valid Clerk JWT token
- Token is automatically refreshed every 50 seconds on the frontend
- Webhook signatures are verified using Svix on every incoming webhook
- Users can only see tasks they own or are assigned to
- Role-based checks are enforced on every mutation at the controller level

---

## Real-Time Architecture

```
Client connects to Socket.io server on page load
         ↓
Client emits "join" with their DB user ID
         ↓
Server adds the socket to a personal room (userId)
         ↓
When a task event occurs on the backend:
  - task:assigned → emits to assignee's room
  - task:updated  → emits to owner + assignee rooms
  - task:deleted  → emits to owner + assignee rooms
         ↓
Client receives the event
         ↓
React Query invalidates ['tasks'] cache
         ↓
UI refetches and updates instantly — no page refresh needed
```

### Socket Events

| Event | Direction | Payload |
|---|---|---|
| `join` | Client → Server | `userId: string` |
| `task:assigned` | Server → Client | Full `Task` object |
| `task:updated` | Server → Client | Full `Task` object |
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

### Post-Deployment Checklist
- Update `VITE_API_URL` in Vercel → your Railway backend URL
- Update `CLIENT_URL` in Railway → your Vercel frontend URL
- Update Clerk webhook URL → your Railway backend URL
- Update Clerk allowed origins → your Vercel frontend URL

---

## Development Progress

| Phase | Feature | Status |
|---|---|---|
| Phase 1 | Project scaffolding + Vite + React + TypeScript | ✅ Complete |
| Phase 1 | Tailwind CSS + custom color palette | ✅ Complete |
| Phase 1 | Clerk Google authentication | ✅ Complete |
| Phase 1 | Login page UI + protected routes | ✅ Complete |
| Phase 2 | Express + TypeScript server | ✅ Complete |
| Phase 2 | Prisma v5 + Neon PostgreSQL | ✅ Complete |
| Phase 2 | Auth middleware (JWT verification) | ✅ Complete |
| Phase 2 | Task CRUD API routes | ✅ Complete |
| Phase 2 | Socket.io real-time server | ✅ Complete |
| Phase 2 | Central error handler middleware | ✅ Complete |
| Phase 3 | Task creation form + modal | ✅ Complete |
| Phase 3 | Task cards with edit/delete/complete | ✅ Complete |
| Phase 3 | Loading skeletons + toast notifications | ✅ Complete |
| Phase 3 | Status filters + stats dashboard | ✅ Complete |
| Phase 3 | Responsive design | ✅ Complete |
| Phase 4 | Clerk webhook + auto user sync on signup | ✅ Complete |
| Phase 4 | Pending assignment resolution | ✅ Complete |
| Phase 4 | Role-based permissions (owner vs assignee) | ✅ Complete |
| Phase 4 | Start task button + full status workflow | ✅ Complete |
| Phase 5 | Deployment — Vercel + Railway | ⏳ Pending |

---

## Contributing

This is a personal project built as a collaborative task manager implementation. Feel free to fork and extend.

---

## License

MIT License — free to use and modify.

---

> Built with ❤️ using React, Node.js, PostgreSQL, and Clerk
