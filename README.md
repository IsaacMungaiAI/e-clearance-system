# Kafu Clearance System

A university clearance workflow system built with Next.js 16, React 19, Supabase, and Drizzle ORM. Streamlines student clearance through multiple departmental steps (finance, library, hostel) with final approval by the registrar.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Components**: Base UI + shadcn/ui
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Auth**: Supabase Auth (email/password)
- **Icons**: Lucide React
- **Tables**: TanStack React Table
- **Toasts**: Sonner

## Roles

| Role              | Description                          |
| ----------------- | ------------------------------------ |
| `student`         | Applies for and tracks clearance     |
| `officer_finance` | Manages fee clearance step           |
| `officer_library` | Manages library clearance step       |
| `officer_hostel`  | Manages hostel clearance & rooms     |
| `registrar`       | Oversees all requests, creates users |

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (configure via `.env`)

### Environment Variables

Copy the following into your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
DATABASE_URL=<your-postgres-connection-string>
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Run migrations with Drizzle Kit:

```bash
npx drizzle-kit push
```

Generate new migrations after schema changes:

```bash
npx drizzle-kit generate
```

## Project Structure

```
├── app/
│   ├── (auth)/login          # Login page
│   ├── actions/              # Server actions (auth, student, finance-officer, hostel-officer, registrar, users)
│   ├── admin/                # Admin routes
│   ├── api/                  # API routes (clearances, create-user, finance-officer, hostel-officer, students)
│   ├── dashboard/            # Role-based dashboards
│   │   ├── student/
│   │   ├── finance_officer/
│   │   ├── hostel_officer/   # Also includes rooms, residents, requests, reports, notifications
│   │   ├── registrar/
│   │   └── createUser/
│   ├── db/                   # Drizzle schema, relations, client
│   └── globals.css
├── components/               # UI components organized by role
│   ├── student/
│   ├── finance-officer/
│   ├── hostel-officer/
│   ├── registrar/
│   └── ui/                   # Shared UI primitives
├── drizzle/                  # Generated SQL migration files
├── hooks/                    # Custom React hooks (use-theme, etc.)
├── lib/                      # Utility functions and Supabase clients
│   └── supabase/             # Server, client, admin, and proxy helpers
├── public/                   # Static assets
└── types/                    # Shared TypeScript types (user, clearance status, etc.)
```

## Features

- **Role-based access control** — dashboards scoped by user role
- **Multi-step clearance workflow** — each department (finance, library, hostel) approves or rejects independently
- **Room management** — Hostel officers can assign rooms and track residents
- **Audit & activity logs** — all state-changing actions are recorded
- **Notifications** — per-user notification system
- **Registrar oversight** — create users, view analytics, search students, audit trail
