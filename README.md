# WhatsApp Clone - Real-Time Chat Application 💬

A full-stack, responsive real-time chat application modeled after WhatsApp Web and WhatsApp Mobile, built using **React Native (Expo)**, **Node.js**, **Express**, **Socket.io**, and **MongoDB Atlas** (with SQLite fallback).

---

## 🌟 Key Features

### 💬 Chat & Real-Time Messaging
- **Individual Chats**: Direct 1-on-1 real-time messaging with online status indicators.
- **Group Chats**: Create custom groups with selected contacts. Includes official pinned group **Vedaz company**.
- **Real-Time Updates**: instant message delivery, typing indicators, and read receipts powered by Socket.io.
- **Permanent Chat Clearing**: Option to clear chat history permanently from MongoDB Atlas storage.

### 📱 Responsive Mobile-First Design
- **WhatsApp Web & Mobile Layout**: Automatically adapts to desktop side-by-side view or 100% full-screen mobile view with back-arrow (`←`) navigation.
- **Header & Popover Menus**: Mobile-optimized attachment menus, emoji/sticker pickers, options popovers, and contact info drawers.
- **Settings & Options**: Access settings, star messages, mark all as read, and manage contacts directly from the menu.

### 🔐 Authentication & Contact Management
- **Registration & Login**: Secure account registration and login via Email, Phone, or Username with password hashing (bcrypt).
- **Forgot Password**: 6-digit OTP verification system for account recovery.
- **Contact Management**: Add new contacts and delete existing contacts with permanent database removal.

### 🗄️ Database
- **MongoDB Atlas Integration**: Primary cloud database connection using Mongoose.
- **SQLite Fallback**: Automatic offline/fallback to local `chat.db` if `MONGO_URI` is unconfigured.

---

## 🏗️ Project Architecture

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

## 🚀 Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Account

---

### 1️⃣ Backend Setup

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

### 2️⃣ Frontend Setup

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

## 📦 Deliverables & Submission Steps

### 1. Push Code to GitHub Repository
To share your project repository:
```bash
git init
git add .
git commit -m "Initial commit - Full-stack WhatsApp clone with MongoDB Atlas"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

### 2. Generate Android APK (using Expo EAS)
To build an installable Android `.apk` file using Expo Application Services:

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```
2. Login to your Expo account:
   ```bash
   eas login
   ```
3. Initialize EAS configuration:
   ```bash
   cd frontend
   eas build:configure
   ```
4. Build standalone APK:
   ```bash
   eas build -p android --profile preview
   ```
5. Download the `.apk` file once the build finishes.

---

### 3. Screen Recording Instructions
If you are unable to generate an APK:
1. Open the web app (`npm run web` inside `frontend`) or mobile preview.
2. Use a screen recorder (e.g. OBS Studio, Windows Game Bar `Win + Alt + R`, or QuickTime) to record:
   - Creating a user / logging in.
   - Sending real-time individual & group messages.
   - Clearing chat / deleting contacts.
   - Opening settings & responsive mobile view.

---

### 4. Upload Deliverables to Google Drive
1. Upload your generated **APK file** (or **Screen Recording video**) to Google Drive.
2. Right-click the uploaded file in Google Drive -> **Share** -> Change permission to **"Anyone with the link"**.
3. Copy the link and share it along with your GitHub repository link.
