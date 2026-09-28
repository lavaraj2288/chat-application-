# Real-Time Chat Application - Backend API & Socket Server

A Node.js, Express, and Socket.io backend powering real-time chat with SQLite persistent storage.

## 🚀 Features

- **Real-Time Communication**: Socket.io bidirectional event pipeline for instant message delivery, connection state management, user online/offline status, and typing indicators.
- **REST APIs**: Endpoints to send messages, fetch paginated chat history, list registered users, and perform dummy authentication login.
- **Database Persistence**: SQLite database (`chat.db`) storing all users and messages, ensuring chat history persists across application reloads.
- **Clean Architecture**: Modular folder structure separating models, controllers, API routes, Socket handlers, and database configuration.

---

## 🛠️ Requirements & Tech Stack

- **Node.js**: v18.x or later
- **Express**: HTTP web framework & REST routes
- **Socket.io**: Real-time WebSocket engine
- **SQLite / sqlite3**: Embedded relational database for zero-config persistence
- **cors & dotenv**: Middleware for cross-origin requests & environment management

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` root directory (refer to `.env.example`):

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=*
DB_PATH=./chat.db
```

---

## 🚀 Setup & Execution Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Server in Development Mode (Nodemon)
```bash
npm run dev
```

### 3. Run Server in Production Mode
```bash
npm start
```

The server will initialize SQLite database tables automatically and listen at `http://localhost:5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check and uptime status |
| `GET` | `/api/messages` | Fetch chat history (Query params: `limit`, `offset`, `receiverId`) |
| `POST` | `/api/messages` | Send message via REST API (`{ senderId, senderName, text }`) |
| `GET` | `/api/users` | Retrieve list of all users and online/offline statuses |
| `POST` | `/api/users/login` | Authenticate or register username (`{ username }`) |
| `PATCH` | `/api/messages/read` | Mark messages as read (`{ messageIds: [...] }`) |

---

## ⚡ Socket.io Events Reference

### Client -> Server Events
- `user_join` (`{ username, userId }`): Registers connected client socket with username.
- `send_message` (`{ text, senderId, senderName }`, `ackCallback`): Sends message in real-time.
- `typing_start`: Broadcasts that current user has started typing.
- `typing_stop`: Broadcasts that current user stopped typing.
- `mark_read` (`{ messageIds }`): Updates message read status in DB.

### Server -> Client Broadcasts
- `new_message`: Delivered instantly to all connected clients.
- `users_list`: Updated array of active users and online badges.
- `user_typing` / `user_stopped_typing`: Typing indicators for active peers.
- `user_joined` / `user_left`: System notifications for connection changes.
