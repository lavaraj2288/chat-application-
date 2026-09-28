# WhatsApp Clone - Real-Time Chat Application 

A full-stack, responsive real-time chat application modeled after WhatsApp Web and WhatsApp Mobile, built using **React Native (Expo)**, **Node.js**, **Express**, **Socket.io**, and **MongoDB Atlas** (with SQLite fallback).

---

##  Key Features

### Chat & Real-Time Messaging
- **Individual Chats**: Direct 1-on-1 real-time messaging with online status indicators.
- **Group Chats**: Create custom groups with selected contacts. Includes official pinned group **Vedaz company**.
- **Real-Time Updates**: instant message delivery, typing indicators, and read receipts powered by Socket.io.
- **Permanent Chat Clearing**: Option to clear chat history permanently from MongoDB Atlas storage.

### Responsive Mobile-First Design
- **WhatsApp Web & Mobile Layout**: Automatically adapts to desktop side-by-side view or 100% full-screen mobile view with back-arrow (`←`) navigation.
- **Header & Popover Menus**: Mobile-optimized attachment menus, emoji/sticker pickers, options popovers, and contact info drawers.
- **Settings & Options**: Access settings, star messages, mark all as read, and manage contacts directly from the menu.

###  Authentication & Contact Management
- **Registration & Login**: Secure account registration and login via Email, Phone, or Username with password hashing (bcrypt).
- **Forgot Password**: 6-digit OTP verification system for account recovery.
- **Contact Management**: Add new contacts and delete existing contacts with permanent database removal.

###  Database
- **MongoDB Atlas Integration**: Primary cloud database connection using Mongoose.
- **SQLite Fallback**: Automatic offline/fallback to local `chat.db` if `MONGO_URI` is unconfigured.

---

##  Project Architecture

```text
chatapplication/
├── backend/                  # Node.js + Express + Socket.io Server
│   ├── src/
│   │   ├── config/           # Database configuration (MongoDB Atlas & SQLite)
│   │   ├── controllers/      # REST API route controllers
│   │   ├── models/           # Mongoose schemas (UserModel, MessageModel) & SQLite models
│   │   ├── routes/           # API Endpoints (/api/messages, /api/users)
│   │   ├── socket/           # Real-time Socket.io event handlers
│   │   └── server.js         # Backend entry point
│   ├── .env                  # Environment variables (PORT, MONGO_URI, etc.)
│   └── package.json
│
└── frontend/                 # React Native Expo Frontend
    ├── src/
    │   ├── components/       # UI Components (Header, ChatBox, ContactInfo, Modals, Drawers)
    │   ├── services/         # Socket & API client service
    │   └── theme/            # WhatsApp Dark Palette Colors (#111B21, #202C33, #00A884)
    ├── App.js                # Main React Native Application Component
    └── package.json
```

---

##  Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account

---

### 1️ Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create or configure `.env` file in `backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_ORIGIN=*

   # Your MongoDB Atlas Connection String
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.cqdx38v.mongodb.net/chatapp?retryWrites=true&w=majority
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   > Server will run at `http://localhost:5000`.

---

### 2️Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch Expo Web or Mobile client:
   - For **Web**:
     ```bash
     npm run web
     ```
   - For **Mobile App (Expo Go / Emulator)**:
     ```bash
     npx expo start
     ```

---

