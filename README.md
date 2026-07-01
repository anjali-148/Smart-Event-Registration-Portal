# 🎫 Smart Event Registration Portal

A full-stack MERN web application for managing events and participant registrations. Built with MongoDB, Express.js, React (Vite), and Node.js — featuring JWT authentication, QR code tickets, admin dashboard, dark mode, and CSV export.

***

## 📸 Features

### Participant
- Browse and search upcoming events by category
- Register for events with instant confirmation
- QR code ticket generation on successful registration
- View all personal tickets and registration history
- Dark / light mode toggle

### Admin
- Create, edit, and delete events
- View all registrations with real-time stats
- Update participant status (Confirmed → Attended / Cancelled)
- Export participant data as CSV
- Dashboard with KPI cards (total events, capacity, bookings)

***

## 🗂️ Project Structure

```
smart-event-portal/
│
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Login, signup, profile
│   │   ├── eventController.js      # Event CRUD + stats
│   │   └── registrationController.js # Register, CSV export
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect + adminOnly
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt)
│   │   ├── Event.js                # Event schema
│   │   └── Registration.js        # Registration + QR data
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── server.js                   # Express app entry point
│
└── frontend/                       # React + Vite
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance + interceptors
    │   ├── components/
    │   │   ├── AdminRoute.jsx      # Admin-only guard
    │   │   ├── EventCard.jsx       # Event card component
    │   │   ├── ProtectedRoute.jsx  # Auth guard
    │   │   ├── Sidebar.jsx         # Navigation sidebar
    │   │   └── TicketCard.jsx      # Ticket + QR display
    │   ├── context/
    │   │   ├── AuthContext.jsx     # Auth state + JWT
    │   │   └── ThemeContext.jsx    # Dark/light mode
    │   ├── pages/
    │   │   ├── AdminPage.jsx       # Admin dashboard
    │   │   ├── EventsPage.jsx      # Browse events
    │   │   ├── LoginPage.jsx       # Login
    │   │   ├── OverviewPage.jsx    # Dashboard overview
    │   │   ├── RegisterPage.jsx    # Sign up
    │   │   ├── RegistrationPage.jsx# Register for event + QR
    │   │   └── TicketsPage.jsx     # My tickets
    │   ├── App.jsx
    │   ├── index.css               # Complete stylesheet
    │   └── main.jsx
    ├── .env
    ├── index.html
    └── package.json
```


## 🚀 Local Setup (Step by Step)

### Step 1 — Clone or create the project folder

```bash
mkdir smart-event-portal
cd smart-event-portal
```

Copy all backend and frontend files into the structure shown above.

***

### Step 2 — Configure backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-event-portal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Replace `<username>` and `<password>` with your actual MongoDB Atlas credentials.  
> ⚠️ Do NOT wrap values in quotes.

***

### Step 3 — Configure frontend environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

***

### Step 4 — Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open a new terminal)
cd frontend
npm install
```

***

### Step 5 — Run the application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Expected output:
```
Server running on port 5000 in development mode
MongoDB connected: cluster0.xxxxx.mongodb.net ✅
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v5.x.x  ready in 300ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

***

## 🍃 MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster**
3. **Database Access** → Add new user → set username + password
4. **Network Access** → Add IP Address → `0.0.0.0/0` (allow all)
5. **Connect** → Drivers → Node.js → Copy the connection string
6. Paste into `backend/.env` as `MONGO_URI`, replacing `<password>`

> The database `smart-event-portal` is created automatically on first use.

***

## 👤 Creating the First Admin Account

After starting the app, register normally at `/signup` and select **Admin** as account type.

Or use this curl command to create an admin directly:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@portal.com","password":"admin123","role":"admin"}'
```

***

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |

### Events
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/events` | Public | List all events (paginated) |
| GET | `/api/events/:id` | Public | Get single event |
| GET | `/api/events/stats` | Admin | Dashboard stats |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |

### Registrations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/registrations` | Protected | Register for event |
| GET | `/api/registrations` | Admin | All registrations |
| GET | `/api/registrations/my` | Protected | My registrations |
| PUT | `/api/registrations/:id/status` | Admin | Update status |
| GET | `/api/registrations/export` | Admin | Download CSV |

***

## 🔐 Authentication Flow

```
User signs up / logs in
        ↓
Backend validates credentials
        ↓
JWT token generated (expires in 7 days)
        ↓
Token stored in localStorage
        ↓
Axios interceptor attaches token to every request
        ↓
Backend middleware verifies token on protected routes
        ↓
401 response → auto logout + redirect to /login
```

***

## 📦 Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18 | Web framework |
| mongoose | ^8.x | MongoDB ODM |
| bcryptjs | ^2.4 | Password hashing |
| jsonwebtoken | ^9.x | JWT auth |
| cors | ^2.8 | Cross-origin requests |
| dotenv | ^16.x | Environment variables |
| morgan | ^1.10 | HTTP request logger |
| nodemon | ^3.x | Dev auto-restart |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.x | UI framework |
| react-router-dom | ^6.x | Client-side routing |
| axios | ^1.x | HTTP client |
| qrcode.react | ^3.x | QR code generation |
| react-hot-toast | ^2.x | Toast notifications |
| vite | ^5.x | Build tool |

***

## 🌙 Dark Mode

The app supports full dark mode:
- **Auto-detects** system preference via `prefers-color-scheme`
- **Manual toggle** via the moon/sun icon in the sidebar footer
- Preference persists across sessions

***


## 🛠️ Available Scripts

### Backend
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Production start
```

### Frontend
```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

***

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `querySrv ENOTFOUND` | Wrong/incomplete MongoDB URI | Copy full URI from Atlas, replace `<password>` |
| `role: participant is not valid` | User model enum mismatch | Set enum to `['participant', 'admin']` in `User.js` |
| `matchPassword is not a function` | Wrong method name called | Use `comparePassword()` in authController |
| `Network Access blocked` | IP not whitelisted in Atlas | Add `0.0.0.0/0` in Atlas Network Access |
| `401 Unauthorized` on all requests | Token missing or expired | Re-login to get a fresh token |
| Blank page on refresh | React Router needs catch-all | Add `/* → index.html` redirect on Vercel/Netlify |

***

## 📄 License

This project is built for educational purposes as part of a MERN stack assignment.

***

## 👩‍💻 Author

**Anjali** — Smart Event Registration Portal  
Built with ❤️ using the MERN stack. 
