# 🎓 LMS System — Surigao del Norte

Learning Management System for **Surigao City** and **San Ricardo**, Surigao del Norte (Region XIII – Caraga).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express.js |
| Frontend | React.js (CRA) |
| Database | MySQL + Sequelize ORM |
| Auth | JWT (JSON Web Tokens) |
| Process Manager | PM2 |
| Web Server | Nginx |

---

## Role Hierarchy

```
Superadmin
  └── Main Admin (per location: Surigao City / San Ricardo)
        └── School Admin (per school)
              ├── Teacher
              └── Student
```

---

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### 1. Run PowerShell setup script (Windows)
```powershell
.\setup.ps1
```

### 2. Manual setup (any OS)

```bash
# Database
mysql -u root -p -e "CREATE DATABASE lms_db;"
mysql -u root -p lms_db < database/schema.sql
mysql -u root -p lms_db < database/seed.sql

# Backend
cd backend
cp .env.example .env    # edit with your DB credentials
npm install
npm run dev             # starts on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm start               # starts on port 3000
```

---

## Default Accounts (password: `password123`)

| Role | Email |
|------|-------|
| Super Admin | superadmin@lms.edu.ph |
| Main Admin (Surigao City) | admin.surigao@lms.edu.ph |
| Main Admin (San Ricardo) | admin.sanricardo@lms.edu.ph |
| School Admin (SNNHS) | admin@snnhs.edu.ph |
| Teacher | a.torres@snnhs.edu.ph |
| Student | juan.delacruz@student.lms.edu.ph |

---

## API Endpoints

| Role | Base URL |
|------|----------|
| Superadmin | `POST /api/superadmin/login` |
| Main Admin | `POST /api/main-admin/login` |
| School Admin | `POST /api/school-admin/login` |
| Teacher | `POST /api/teacher/login` |
| Student | `POST /api/student/login` |

All protected routes require `Authorization: Bearer <token>` header.

---

## Features

- ✅ **Multi-role auth** — 5 roles with JWT
- ✅ **Location management** — Surigao City & San Ricardo
- ✅ **School management** — Multiple schools per location
- ✅ **Student management** — Full CRUD with ID numbers
- ✅ **Teacher management** — Course assignment
- ✅ **Course management** — Schedule, room, units
- ✅ **Enrollment** — Request → Approve workflow
- ✅ **Attendance** — Per session, per course
- ✅ **Exams & Grades** — Multiple types, auto publish
- ✅ **Payments** — GCash, Maya, Cash, Bank support
- ✅ **Events** — School-wide and section events
- ✅ **Automated backups** — Daily + weekly cron

---

## Project Structure

```
lms-system/
├── backend/          # Node.js + Express API
├── frontend/         # React SPA
├── database/         # schema.sql + seed.sql
├── deployment/       # nginx, pm2, backups
├── setup.ps1         # Windows PowerShell setup
└── README.md
```

---

## Deployment

See [`deployment/serverSetup.md`](deployment/serverSetup.md) for full production deployment instructions.

---

*Built for Surigao del Norte — Region XIII (Caraga), Philippines.*
