# YatraSetu

**Pilgrim safety, emergency response, and healthcare coordination platform.**

YatraSetu connects pilgrims, volunteers, NGOs, hospitals, weather officers, police, and control-room teams through a centralized platform.

## Key Features

* Pilgrim registration with QR identification
* Emergency and medical assistance
* Volunteer management and assignments
* NGO food and water distribution
* Hospital and medical management
* Diagnosis and prescriptions
* Ambulance requests
* Bed availability
* Weather and emergency alerts
* Missing-person management
* Role-based dashboards
* Reports and analytics
* JWT authentication
* Real-time communication

## Architecture

```text
                    ┌─────────────────────┐
                    │     YatraSetu UI    │
                    │ React + Vite        │
                    │ Tailwind + Leaflet  │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express    │
                    │     Backend API      │
                    ├─────────────────────┤
                    │ Auth / RBAC          │
                    │ Pilgrims             │
                    │ Volunteers           │
                    │ Hospitals            │
                    │ NGO Operations       │
                    │ Weather              │
                    │ Emergency Services   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌────────────┐  ┌────────────┐  ┌────────────┐
        │  MongoDB   │  │ Socket.IO  │  │ AI/External│
        │  Database  │  │ Real-time  │  │  Services  │
        └────────────┘  └────────────┘  └────────────┘
```

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Axios
* Leaflet / React Leaflet
* Recharts
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.IO
* Multer

## User Roles

```text
Pilgrim
Volunteer
NGO / Relief Team
Hospital / Medical
Weather Officer
Police
Control Room
Admin
Super Admin
```

## Project Structure

```text
YatraSetu/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── routes/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

## Run Project

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```
---
## ⭐ Support
If you found this project helpful, consider giving it a star ⭐ on GitHub!
