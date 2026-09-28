# Real-Time Chat Application - React Native (Expo) Frontend

Cross-platform React Native frontend application supporting Web, Android, and iOS with real-time Socket.io messaging and REST API integration.

## 📱 Features

- **Real-Time Instant Messaging**: Powered by Socket.io client for zero-refresh message broadcasting.
- **Persistent Chat History**: Automatically loads history via REST API on startup and supports pull-to-refresh.
- **Cross-Platform Support**: Built with React Native & Expo for Web (`npm run web`), Android emulator/device (`npm run android`), and iOS simulator (`npm run ios`).
- **Real-Time Typing Indicator**: Animated "... is typing" badge triggered as users type.
- **Online/Offline User Status**: Displays active user list with live green online status badges.
- **Message Timestamps & Read Receipts**: Human-readable timestamps (e.g., `12:45 PM`) and status checkmarks (`✓` / `✓✓`).
- **User Authentication**: Dummy login modal with quick sample user selection.
- **Connection Banner**: Visual warning banner when socket disconnects or reconnects.

---

## 🛠️ Tech Stack & Dependencies

- **React Native / Expo SDK**: Cross-platform mobile & web framework
- **Socket.io Client**: Real-time websocket transport
- **Axios**: Promise-based HTTP client for REST requests
- **date-fns**: Clean date & timestamp formatting
- **react-native-web**: Web engine adapter

---

## 🚀 Setup & Execution Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Run on Web Browser
```bash
npm run web
```
Open `http://localhost:8081` in your browser.

### 3. Run on Mobile (Android / Expo Go)
- **Expo Go App**: Install Expo Go on your mobile device, run `npx expo start`, and scan the QR code displayed in terminal.
- **Android Emulator**: Ensure Android Studio / emulator is running, then execute:
  ```bash
  npm run android
  ```

---

## 🔧 Backend Connection Configuration

The backend URL configuration is defined in [`src/config/api.js`](src/config/api.js):
- **Web / iOS Simulator**: `http://localhost:5000`
- **Android Emulator**: `http://10.0.2.2:5000`
- **Physical Device**: Replace with your local machine's local IP address (e.g. `http://192.168.x.x:5000`).
