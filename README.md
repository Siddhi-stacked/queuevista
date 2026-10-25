# QueueVista – Real-Time Visibility for Digital Queues

A third-year B.Tech CSE mini-project that digitizes physical queues for clinics, banks, government offices, and service centers.

---

## 🚀 Tech Stack

- **Frontend**: React 18+ (Vite), TypeScript, Tailwind CSS, React Router v7, Axios, Lucide Icons
- **Design System**: Clean Light Theme, Primary Blue `#2563EB`, Card Background `#FFFFFF`, Base Background `#F8FAFC`, Inter font, responsive layout with mobile hamburger navigation and desktop sidebar.
- **Backend (Later Phase)**: Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, PostgreSQL, WebSocket/STOMP.
  > *Note: In accordance with Step 1, all API calls are abstracted through `/src/services` using Axios mock handlers and reactive context.*

---

## 📁 Project Directory Structure

```text
queuevista/
├── docs/
│   └── SPEC.md                      # Complete system specification
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Sidebar, Breadcrumbs, DashboardLayout, PublicLayout
│   │   │   └── ui/                  # Button, Input, Select, Modal, Card, Badge, DataTable,
│   │   │                            # Pagination, TokenCard, ServiceCard, AppointmentCard,
│   │   │                            # StatCard, ConfirmDialog, Toast, LoadingSpinner, EmptyState, ErrorState
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Mock authentication & demo role switcher
│   │   │   ├── QueueContext.tsx      # Unified reactive queue & live simulation engine
│   │   │   └── ToastContext.tsx      # Toast notifications
│   │   ├── mock/                    # Realistic seed data (U001, S001, C002, D-108, A-204)
│   │   │   ├── users.ts
│   │   │   ├── organizations.ts
│   │   │   ├── services.ts
│   │   │   ├── counters.ts
│   │   │   ├── queueEntries.ts
│   │   │   ├── appointments.ts
│   │   │   ├── notifications.ts
│   │   │   └── analytics.ts
│   │   ├── services/                # Axios-based service layer (ready for Spring Boot REST API)
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── queueService.ts
│   │   │   ├── serviceService.ts
│   │   │   ├── counterService.ts
│   │   │   ├── appointmentService.ts
│   │   │   ├── notificationService.ts
│   │   │   └── analyticsService.ts
│   │   ├── types/
│   │   │   └── index.ts             # Domain models & TypeScript interfaces
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx        # Route definitions
│   │   │   └── ProtectedRoute.tsx   # Role-based route protection
│   │   ├── pages/
│   │   │   ├── public/              # LandingPage, LoginPage, RegisterPage, NotFoundPage
│   │   │   ├── user/                # UserDashboard, ServicesPage, LiveQueuePage, AppointmentsPage,
│   │   │   │                        # NotificationsPage, HistoryPage, ProfilePage
│   │   │   ├── staff/               # StaffDashboard, StaffQueuePage, StaffCountersPage,
│   │   │   │                        # StaffAppointmentsPage, StaffHistoryPage
│   │   │   └── admin/               # AdminDashboard, AdminServicesPage, AdminStaffPage,
│   │   │                            # AdminCountersPage, AdminAppointmentsPage, AdminQueuesPage,
│   │   │                            # AdminAnalyticsPage, AdminSettingsPage
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.app.json
└── README.md
```

---

## 🔑 Demo Credentials & Fast Role Switcher

The top navbar includes an instant **Demo Role Switcher** (`User`, `Staff`, `Admin`) along with 1-click evaluation buttons on `/login`:

| Role | Name | ID | Default Landing | Context |
|---|---|---|---|---|
| **User** | Siddhi Patel | `U001` | `/user/dashboard` | Holds live Token `D-108`, booked Appointment `A-201` |
| **Staff** | Rajesh Kumar | `S001` | `/staff/dashboard` | Assigned to Counter 2 (General Consultation) |
| **Admin** | Dr. Anita Roy | `A001` | `/admin/dashboard` | City Care Clinic Administrator |

---

## 🔄 Live Queue Synchronization Demo

To demonstrate real-time queue advancement without the backend:

1. **User View**:
   - Go to `/user/queue/D-108` (or click **Track Live Queue** on Dashboard).
   - Observe: **Your Token: D-108**, **Currently Serving: D-104**, **Position: #4**, **People Ahead: 3**, **Estimated Wait: 18 min**.
   - Sequence chain: `D-104 → D-105 → D-106 → D-107 → YOU: D-108`.

2. **Staff Action**:
   - Switch to **Staff** using the top navbar demo switcher.
   - On Counter 2 Console (`/staff/dashboard`), click **"Next Token"**.
   - Current token `D-104` completes, and `D-105` is called.

3. **Verify Synchronized Update**:
   - Switch back to **User** (`/user/queue/D-108`).
   - Notice: **Currently Serving: D-105**, **Position moves from #4 to #3**, **People Ahead moves from 3 to 2**, **Wait time decreases from 18 min to 14 min**.
   - A new notification is automatically pushed to `/user/notifications`.

---

## 🛠️ Commands to Run

### 1. Navigate to the frontend directory
```bash
cd frontend
```

### 2. Install dependencies (already installed)
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for production & verify TypeScript types
```bash
npm run build
```
Build output is generated in `frontend/dist/`.
