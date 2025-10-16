# 🧑‍💼 JobHub — Job Seekers & Employers Platform (Backend)

A secure, scalable backend for a two-sided marketplace connecting **job seekers (applicants)** and **employers (talent seekers)**.  
Built with **TypeScript**, **Express.js**, **Prisma ORM**, **PostgreSQL**, and **Redis** for caching and OTP verification.

---

## 🚀 Features

- User signup with email/phone verification (OTP)
- JWT-based authentication & authorization (Admin / Employer / Employee)
- Role-based access control
- PostgreSQL (via Prisma ORM)
- Redis integration for caching & 2FA/OTP
- Dockerized for full reproducibility
- Health & DB check routes
- Scalable architecture ready for BullMQ, payments, and messaging

---

## 🧱 Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Language         | TypeScript              |
| Framework        | Express.js              |
| ORM              | Prisma                  |
| Database         | PostgreSQL              |
| Cache / Queue    | Redis                   |
| Authentication   | JWT                     |
| Containerization | Docker + Docker Compose |

---

## 📦 Folder Structure

```
src/
├── config/
│   ├── prisma.ts          # Prisma client
│   └── redis.ts           # Redis connection
├── routes/
│   └── health.routes.ts   # Health + DB check
├── server.ts              # Entry point
├── middlewares/           # (global error handling, auth, etc.)
└── modules/               # (users, jobs, orgs, applications)
prisma/
└── schema.prisma          # Prisma models
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/jobhub?schema=public

# Redis
REDIS_URL=redis://redis:6379

# Server
PORT=4000

# Security
JWT_SECRET=supersecret
```

---

## 🐳 Local Setup (Docker)

### 1️⃣ Clone & Enter Project

```bash
git clone https://github.com/ariffaisal-github/Job-Hub.git
cd jobhub
```

### 2️⃣ Add `.env` File

Copy the environment variables above into a `.env` file.

### 3️⃣ Build & Start Containers

```bash
docker compose up --build
```

Wait until logs show:

```
🚀 Server on :4000
✅ Prisma connected
✅ Redis connected
```

### 4️⃣ Apply Database Migrations

Run inside container:

```bash
docker compose exec api npx prisma migrate dev --name init
```

### 5️⃣ Verify Setup

Open in your browser:

- ✅ [http://localhost:4000/api/health](http://localhost:4000/api/health)
- ✅ [http://localhost:4000/api/dbcheck](http://localhost:4000/api/dbcheck)

### 6️⃣ (Optional) View Database in Prisma Studio

```bash
docker compose exec api npx prisma studio
```

Then open [http://localhost:5555](http://localhost:5555)

---

## 🧩 API Endpoints (So far)

| Method | Route          | Description            |
| ------ | -------------- | ---------------------- |
| `GET`  | `/api/health`  | Check Redis connection |
| `GET`  | `/api/dbcheck` | Verify DB connection   |

---

## 🔐 Roles & Permissions (Upcoming)

| Role         | Capabilities                                     |
| ------------ | ------------------------------------------------ |
| **Admin**    | Manage all users, employers, employees, orgs     |
| **Employer** | Create organizations, post jobs, view applicants |
| **Employee** | Create profiles, upload resumes, apply for jobs  |

---

## 🧰 Development Commands

| Command                              | Description              |
| ------------------------------------ | ------------------------ |
| `npm run dev`                        | Start server in dev mode |
| `npm run build`                      | Compile TypeScript to JS |
| `npm start`                          | Start compiled JS server |
| `npx prisma studio`                  | Open visual DB UI        |
| `npx prisma migrate dev --name init` | Apply DB migrations      |

---

## 🚀 Deployment Notes

- This backend is fully containerized.
- It can be deployed to Render, Railway, Fly.io, or AWS ECS.
- Make sure to set `DATABASE_URL` and `REDIS_URL` in the platform’s environment.

---

## ✅ Verification Checklist (for reviewers)

1. Server builds and runs with `docker compose up --build`
2. `.env` file correctly configured
3. `Prisma migrate` applies schema
4. `/api/health` and `/api/dbcheck` return success JSON
5. Project folder clean (no `node_modules`, `.env`, or `dist` committed)
6. Optional: Prisma Studio opens via `http://localhost:5555`

---

## 🗂️ Database Schema (ERD)

![Database ER Diagram](./docs/ERD.png)

## 👨‍💻 Author

**Arif Faisal**  
Backend Engineer | JTypeScript · Node.js · Express.js  
📧 ariffaisal18.19@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/arif-faisal-97976a1a7/)
