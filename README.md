# 🌱 First Step for Success

> **A modern, cozy MERN stack personal daily work journal, interactive monthly calendar, and task reminder application.**  
> *"Every big accomplishment begins with taking the first step."*

---

## 🌟 Key Features

### 1. Authentication & Welcoming Vibe
- **Secure Authentication**: User registration and login powered by **JSON Web Tokens (JWT)** and **bcrypt** password encryption.
- **Cute DiceBear Avatars**: Interactive avatar generation based on username seeds and customizable cute styles (`adventurer`, `notionists`, `bottts`, `lorelei`, `fun-emoji`).
- **Cozy Inspiration Generator**: Heartwarming, rotating daily motivational quotes on both the login landing page and the dashboard.
- **Strict Data Isolation**: Every daily work bullet point and task reminder is tied to the authenticated user's unique `userId` in MongoDB Atlas.

### 2. Modern Two-Column Dashboard Layout
- **Column 1 (Left — Interactive Calendar View)**:
  - Monthly calendar grid with month navigation and "Today" quick jump.
  - **Inline bullet points**: Every date cell displays what work was completed on that day directly in the calendar box.
  - Interactive click/double-click on any date to open the **Daily Work Journal Modal** to add, edit, or clear bullet points, set daily mood, and log reflections with celebration confetti.
  - Visual badges indicating upcoming reminders scheduled for that date.
- **Column 2 (Right — Dedicated "REMAINDER!!" Column)**:
  - Dedicated upcoming tasks sidebar panel.
  - Add tasks with target date, time, priority (*Low*, *Medium*, *High*), category (*Work*, *Study*, *Meeting*, *Urgent*, *Personal*), and notes.
  - Seamless sync with the calendar view: clicking a reminder date synchronizes the active calendar date.
  - Toggle completion status, filter by *All*, *Selected Date*, *Pending*, and *Done*.

---

## 🏗️ Architecture & Folder Structure

```
TODO/
├── server/                             # Node.js & Express REST API
│   ├── config/
│   │   └── db.js                       # Mongoose MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js           # Register, login, getMe, updateAvatar
│   │   ├── dailyLogController.js       # Monthly work logs, daily bullets CRUD
│   │   └── reminderController.js       # Upcoming tasks & reminders CRUD
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT Bearer token protection
│   ├── models/
│   │   ├── User.js                     # User schema (bcrypt hashing, DiceBear)
│   │   ├── DailyLog.js                 # Daily work bullets schema (per user/date)
│   │   └── Reminder.js                 # Upcoming reminders schema
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth
│   │   ├── dailyLogRoutes.js           # /api/logs
│   │   └── reminderRoutes.js           # /api/reminders
│   ├── .env.example                    # Sample environment variables
│   ├── package.json                    # Backend dependencies
│   └── server.js                       # Express server entry point
│
├── client/                             # React + Vite + Tailwind CSS Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js               # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Header, avatar reroll, live stats
│   │   │   ├── CuteQuoteBanner.jsx     # Cozy motivational quote widget
│   │   │   ├── StatsCard.jsx           # Journal days, bullets, reminder queue
│   │   │   ├── CalendarGrid.jsx        # Column 1: Monthly grid with inline bullets
│   │   │   ├── DayModal.jsx            # Modal to add/edit completed work
│   │   │   └── ReminderSidebar.jsx     # Column 2: Dedicated "REMAINDER!!" column
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global user & JWT state provider
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx            # Landing page with login & registration
│   │   │   └── DashboardPage.jsx       # Two-column synchronized workspace
│   │   ├── App.jsx                     # Root router/switcher
│   │   ├── index.css                   # Tailwind directives & glassmorphism
│   │   └── main.jsx                    # React 18+ DOM root
│   ├── tailwind.config.js              # Custom brand color tokens & shadows
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json                        # Root scripts
└── README.md
```

---

## 🗄️ Database Schemas (MongoDB Atlas / Mongoose)

### 1. `User` Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  avatarSeed: { type: String, default: "user_..." },
  avatarStyle: { type: String, default: "adventurer" },
  bio: { type: String, default: "First step today, success tomorrow ✨" },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. `DailyLog` Model (Calendar Work Journal)
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true, index: true }, // 'YYYY-MM-DD'
  bulletPoints: [{ type: String }],                   // Inline completed work bullets
  summary: { type: String, default: '' },             // Daily reflection
  mood: { type: String, enum: ['productive', 'victorious', 'calm', 'focused', 'busy'] }
}
// Compound unique index: { user: 1, date: 1 }
```

### 3. `Reminder` Model ("REMAINDER!!" Column)
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  date: { type: String, required: true, index: true }, // 'YYYY-MM-DD'
  time: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, enum: ['work', 'study', 'meeting', 'personal', 'urgent'] },
  completed: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}
```

---

## 🚀 Getting Started

### 1. Clone & Enter Project
```bash
git clone https://github.com/shreedeviubhat-max/TODO.git
cd TODO
```

### 2. Configure Backend Environment
Navigate to `server/` and create `.env`:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/first_step_success?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```
*(You can also use a local MongoDB instance `mongodb://127.0.0.1:27017/first_step_success`)*

### 3. Run Backend Server
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`

### 4. Run Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📡 RESTful API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user with cute avatar | No |
| `POST` | `/api/auth/login` | Login with email & password, returns JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |
| `PUT` | `/api/auth/avatar` | Customize/roll DiceBear avatar seed | Yes (JWT) |
| `GET` | `/api/logs?month=YYYY-MM` | Fetch user daily logs for monthly calendar | Yes (JWT) |
| `GET` | `/api/logs/:date` | Fetch completed work bullets for a date | Yes (JWT) |
| `PUT` | `/api/logs/:date` | Upsert daily work bullets, mood & notes | Yes (JWT) |
| `DELETE` | `/api/logs/:date` | Clear work bullets for a date | Yes (JWT) |
| `GET` | `/api/reminders` | Fetch upcoming task reminders | Yes (JWT) |
| `POST` | `/api/reminders` | Add task to REMAINDER!! column | Yes (JWT) |
| `PUT` | `/api/reminders/:id` | Update reminder details | Yes (JWT) |
| `PATCH` | `/api/reminders/:id/toggle` | Toggle task completion status | Yes (JWT) |
| `DELETE` | `/api/reminders/:id` | Delete reminder | Yes (JWT) |
| `GET` | `/api/quote` | Fetch cute cozy motivational quote | No |
| `GET` | `/api/health` | Server health status check | No |

---

## 🎨 UI Aesthetic Highlights
- **Curated Palette**: Fresh emerald greens, cozy amber accents, soft cream and slate neutrals.
- **Glassmorphism**: Modern frosted glass cards with blur backdrops.
- **Micro-Interactions**: Celebratory confetti upon logging daily achievements, interactive avatar roller, hover animations.
- **Responsive**: Two-column layout on desktop, stacked layout on mobile devices.