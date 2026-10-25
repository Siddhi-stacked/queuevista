# QueueVista
## Project Specification – Real-Time Visibility for Digital Queues

## 1. Project Overview

QueueVista – Real-Time Visibility for Digital Queues. A third-year B.Tech CSE mini-project that digitizes physical queues for clinics, banks, government offices and service centers.

- Frontend: React, TypeScript (Vite), Tailwind CSS, React Router, Axios
- Backend (later phases): Java 17, Spring Boot 3, Spring Security, JWT, Spring Data JPA, PostgreSQL, WebSocket/STOMP
- First build the frontend with mock/local data. Do NOT implement the backend in that step. Organize the mock data layer so it can later be replaced by Axios calls to a Spring Boot REST API.

## 2. Design Requirements

The app must look like a strong third-year B.Tech student project: realistic, usable and implementable. It must NOT look like a futuristic AI product, startup landing-page template, Dribbble concept, enterprise SaaS dashboard, or a design full of gradients and glassmorphism. Avoid neon, 3D illustrations, large animations, floating elements, excessive rounded cards and shadows.

- Clean light theme; font Inter; moderate border radius; subtle shadows
- Colors: primary blue #2563EB, background #F8FAFC, cards #FFFFFF, text #111827, secondary text #6B7280, borders #E5E7EB, success #16A34A, warning #F59E0B, danger #DC2626
- Use blue for primary buttons, active navigation, links, selected states and important queue information
- Prioritize usability, readability, functionality, realistic spacing and data, consistent components

## 3. Roles

- USER: browses services, joins a queue, receives a token, tracks live position, books appointments, gets notifications, views history
- STAFF: manages a service counter; sees the waiting queue; calls next, recalls, skips, transfers, cancels tokens; manages appointments
- ADMIN: manages services, counters, staff, queues; views appointments and analytics; monitors operations
Implement role-based frontend routing using mock authentication.


## 4. Routes

Public: / , /login , /register

User: /user/dashboard, /user/services, /user/queue, /user/queue/:token, /user/appointments, /user/notifications, /user/history, /user/profile

Staff: /staff/dashboard, /staff/queue, /staff/counters, /staff/appointments, /staff/history

Admin: /admin/dashboard, /admin/services, /admin/staff, /admin/counters, /admin/appointments, /admin/queues, /admin/analytics, /admin/settings

Protect routes by the current mock user role.


## 5. Landing Page

Header: QueueVista logo; nav Home, How It Works, Services, Login, Get Started.

Hero heading: "Skip the uncertainty. Know your place in the queue." Description: "Join digital queues, book appointments, and track your token in real time without standing in line." Buttons: Join a Queue, Book Appointment.

Right side: a queue-tracking preview card (Token D-108, Currently Serving D-104, Position 4, People Ahead 3, Estimated Wait 18 min, Status Waiting). No huge illustration.


## 6. Authentication

- Login: Email, Password, Remember me, Forgot password, Login button
- Register: Full Name, Email, Phone, Password, Confirm Password, Create Account button
- A small, clearly labelled DEMO section: Login as User / Staff / Admin. No real backend.

## 7. Shared Layout and Components

Sidebar, top navigation, page header, notification icon, user profile menu, breadcrumbs, Button, Input, Select, Modal, Card, Badge, DataTable, Pagination, QueueStatus, TokenCard, ServiceCard, AppointmentCard, NotificationItem, StatCard, ChartCard, ConfirmDialog, Toast, LoadingSpinner, EmptyState, ErrorState. One design system used everywhere.


## 8. User Pages

- Dashboard: "Good morning, Siddhi" / "Here's your current queue activity." Current Queue card (City Care Clinic, General Consultation, Token D-108, Currently Serving D-104, Position 4, People Ahead 3, Wait 18 min, Status Waiting; buttons View Queue, Leave Queue). Available Services: General Consultation (7 waiting, 20 min), Billing Counter (3, 8 min), Document Verification (10, 25 min), each with Join Queue and Book Appointment. Upcoming Appointment with date, time, service, ID and status.
- Find Service (/user/services): search "Search services or organizations..."; filters Organization, Service, Availability, Waiting Time; service cards with Join Queue / Book Appointment.
- Join Queue flow: select organization and service; show queue size, estimated wait, operating hours, priority availability; "Confirm & Join Queue"; then "You're in the queue!" with token D-108, People Ahead 3, Estimated Wait 18 minutes, Currently Serving D-104, Status Waiting, button Track My Queue. Mock state must really change the UI.
- Live Queue (/user/queue/:token): your token, currently serving, position, people ahead, estimated wait, status; visual chain D-104 → D-105 → D-106 → D-107 → YOU: D-108 with the user's token highlighted; text "Queue information updates automatically."; buttons Leave Queue, View Service, Notification Preferences; mobile-friendly large token.
- Appointments: select organization, service, date, time slot (09:30, 10:00, 10:30, 11:00, 11:30 AM); confirm; show Appointment ID, organization, service, date, time, status; lists of Upcoming and Past appointments.
- Notifications: token generated, position changed 6 to 4, approaching your turn, token being called, appointment tomorrow 10:30 AM; read/unread, mark as read, mark all as read, timestamps.
- History: table Date, Organization, Service, Token, Type, Wait Time, Status with filters and pagination (e.g. 12 Sep 2026, City Care Clinic, General Consultation, D-108, Walk-in, 18 min, Completed).

## 9. Staff Pages

- Dashboard: organization City Care Clinic, Counter 2, status Active, current token D-104; buttons Next Token, Recall, Skip, Transfer, Cancel. Waiting Queue table: Position, Token, Type, Priority, Wait Time, Status, Actions (e.g. D-105 Walk-in Normal 4 min; D-106 Appointment High 7 min; D-107 Walk-in Normal 11 min; D-108 Walk-in Normal 15 min).
- Next Token must: change the current token, update queue positions and waiting count, record activity, show a toast; D-104 becomes Completed, D-105 becomes current.
- Counters: Counter 1 Billing Active B-104; Counter 2 General Consultation Active D-104; Counter 3 Document Verification Idle; buttons Activate, Deactivate, Change Service.

## 10. Admin Pages

- Dashboard: Total Served 128, Currently Waiting 24, Average Wait 14 min, No-Shows 7, Cancellations 12; Live Queue Overview; Recent Activity (Counter 2 called D-104, D-103 completed, Appointment A-204 checked in, D-102 skipped).
- Services: table Service Name, Organization, Counter, Average Service Time, Priority, Status, Actions (Edit, Deactivate, Delete); Add Service modal (name, description, average service time, priority enabled, max queue size, operating hours); saved service appears in the table.
- Staff: table Name, Email, Assigned Counter, Role (STAFF/ADMIN), Status, Last Active, Actions; Add Staff; activate/deactivate.
- Counters: view all; Add, Edit, Assign Service, Activate, Deactivate.
- Queue Management: per-service Current Token, Waiting, Average Wait, Status; inspect queue activity.
- Analytics: filters Today / Last 7 Days / Last 30 Days; stats Completed Services, Average Waiting Time, Average Service Time, Cancellations, No-Shows, Peak Hour; simple charts (completed by hour, average waiting time, queue status distribution, peak hours).
- Settings: Organization, Queue, Notification and Account settings forms.

## 11. Mock Data and Real-Time Behaviour

Mock data for users, organizations, services, counters, queueEntries, appointments, notifications, analytics, with realistic IDs (U001, S001, C002, token D-108, appointment A-204).

Simulate real-time locally: when staff clicks Next Token, the current token, queue positions and waiting count change, the user's live queue screen updates and a notification appears. Keep this in one queue context so it can later be replaced by WebSocket/STOMP events. Do not claim a real WebSocket connection exists in the prototype.


## 12. Empty, Error and Loading States

"No one is currently waiting.", "Service is currently closed.", "No appointments found.", "Your queue has ended.", "Unable to load queue information.", "Something went wrong." plus loading indicators.


## 13. Responsiveness

Desktop: sidebar + content. Tablet: condensed navigation. Mobile: hamburger menu, stacked cards, scrollable tables, large readable token. The Live Queue page must stay clear on mobile.


## 14. Demo Flow

User: Login as User → Dashboard → Find Service → Join Queue → receive D-108 → Track Queue.

Staff: Login as Staff → Dashboard → see D-108 → Next Token → queue updates.

User: live queue reflects the new position.

Admin: Login as Admin → Dashboard → Analytics → Manage Services → Manage Staff.


## 15. Backend Plan (later phases)

- Entities: User, Organization, Service, Counter, QueueEntry, Appointment, Notification
- Spring Security with JWT and roles USER / STAFF / ADMIN
- REST APIs: auth, services, join/leave queue, my position, staff actions (next, recall, skip, transfer, cancel), appointments, notifications, admin CRUD, analytics
- WebSocket/STOMP topic /topic/queue/{serviceId} for live updates
- PostgreSQL schema and JUnit tests for the queue service

## 16. Final Quality Rule

Review everything for consistency: typography, buttons, spacing, colors, sidebar, navbar, tables, badges, modals and responsive behaviour must be the same across all pages. The result should look human-designed, practical and believable, something a third-year B.Tech student could explain, implement and demonstrate.

