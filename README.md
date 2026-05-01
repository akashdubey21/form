# FormBuilder — Dynamic Forms & Analytics Platform

A full-stack web application for building dynamic forms, collecting responses, and visualizing analytics. Built with React + TypeScript + Tailwind CSS on the frontend and Express.js + MongoDB on the backend.

---

## 🏗️ Architecture

```
┌─────────────────────┐       HTTP/REST       ┌──────────────────────┐
│    React Client      │ ─────────────────────▶│  Express.js Server   │
│  (Vite + TS +       │                        │  (Port 5000)         │
│   Tailwind CSS)     │ ◀─────────────────────  │                      │
└─────────────────────┘       JSON             └──────────┬───────────┘
                                                           │ Mongoose
                                                           ▼
                                              ┌──────────────────────┐
                                              │   MongoDB            │
                                              │  (Forms + Responses) │
                                              └──────────────────────┘
```

### Data Flow

1. **Admin creates form** → `POST /api/forms` → stored in MongoDB
2. **Admin copies link** → `/form/:id` shareable URL
3. **User opens link** → `GET /api/forms/:id` → form rendered dynamically
4. **User submits** → `POST /api/forms/:id/submit` → validated + stored as Response
5. **Admin views analytics** → `GET /api/forms/:id/analytics` → aggregated stats

---

## 📁 Folder Structure

```
Task- Forms/
├── server/                    # Express.js backend
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/
│   │   └── formController.js  # All request handlers
│   ├── models/
│   │   ├── Form.js            # Form schema
│   │   └── Response.js        # Response schema
│   ├── routes/
│   │   └── formRoutes.js      # Express Router
│   ├── utils/
│   │   └── analytics.js       # Analytics computation
│   ├── seed.js                # Sample data seeder
│   └── server.js              # App entry point
│
└── client/                    # React frontend
    └── src/
        ├── components/        # Reusable UI components
        │   ├── Navbar.tsx
        │   ├── FieldBuilder.tsx
        │   ├── LoadingSpinner.tsx
        │   └── EmptyState.tsx
        ├── pages/
        │   ├── AdminDashboard.tsx
        │   ├── CreateForm.tsx
        │   ├── FormRenderer.tsx
        │   ├── Responses.tsx
        │   └── Analytics.tsx
        ├── services/api.ts    # Axios API layer
        ├── types/index.ts     # TypeScript interfaces
        └── App.tsx            # Router + Toaster
```

---

## 🔌 API Endpoints

| Method | Endpoint                     | Description                         |
|--------|------------------------------|-------------------------------------|
| POST   | `/api/forms`                 | Create a new form                   |
| GET    | `/api/forms`                 | List all forms                      |
| GET    | `/api/forms/:id`             | Get form by ID                      |
| POST   | `/api/forms/:id/submit`      | Submit a response (with validation) |
| GET    | `/api/forms/:id/responses`   | Get all responses for a form        |
| GET    | `/api/forms/:id/analytics`   | Get analytics for a form            |
| GET    | `/api/health`                | Health check                        |

### Example: Create Form

```json
POST /api/forms
{
  "title": "Job Application",
  "fields": [
    { "label": "Full Name", "type": "text", "required": true },
    { "label": "Experience", "type": "number", "required": true },
    { "label": "Role", "type": "select", "required": true, "options": ["Engineer", "Designer"] }
  ]
}
```

### Example: Analytics Response

```json
{
  "totalResponses": 10,
  "fieldStats": {
    "Experience": { "average": 4.5, "count": 10 },
    "Role": { "Engineer": 6, "Designer": 4 }
  }
}
```

---

## ✅ Features

- ✅ Create forms with text, number, and select fields
- ✅ Dynamic field builder with required toggle
- ✅ Auto-generated shareable links
- ✅ Client-side and server-side form validation
- ✅ Response storage in MongoDB
- ✅ Responses table with dynamic columns
- ✅ Bar charts for select fields (Recharts)
- ✅ Average display for number fields
- ✅ Copy shareable link button
- ✅ Toast notifications
- ✅ Loading spinners and empty states
- ✅ Fully responsive dark-mode UI

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/akashdubey21/form.git
cd Task-Forms
```

### 2. Start the backend

```bash
cd server
npm install

npm run seed    # Load sample data
npm run dev     # Start on port 5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev     # Start on port 5173
```

Visit **http://localhost:5173**

---

## 🌱 Sample Data

Run `node seed.js` in the `server/` directory to populate:

| Form                | Fields | Responses |
|---------------------|--------|-----------|
| Job Application     | 5      | 3         |
| Event Registration  | 5      | 2         |
| Feedback            | 5      | 3         |

---

## 🚢 Deployment

### Backend →  Render

1. Set environment variable: `MONGODB_URI=<your-atlas-uri>`
2. Deploy the `server/` folder
3. Note the deployed URL

### Frontend → Vercel

1. Set environment variable: `VITE_API_URL=https://<your-backend-url>/api`
2. Deploy the `client/` folder with Vercel

---

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, TypeScript, Tailwind CSS 3    |
| Charts    | Recharts                                |
| Routing   | React Router v7                         |
| HTTP      | Axios                                   |
| Toast     | react-hot-toast                         |
| Backend   | Express.js, Node.js                     |
| Database  | MongoDB, Mongoose                       |
| Build     | Vite 8                                  |
