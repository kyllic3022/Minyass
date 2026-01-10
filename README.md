# Minyass 🚀

Minyass is a cosmic-themed mobile application built with React Native and Expo, designed for partners to stay connected in a shared digital space. It uses Firebase Realtime Database for instant synchronization and a Node.js-based notifier to send push notifications, creating a sense of presence even when apart.

![Cosmic Theme](https://i.imgur.com/placeholder.png "A placeholder image showing a cosmic-themed app interface")
*(App interface has a dark, space-like background with neon text and icons.)*

---

## ✨ Core Features

-   **Cosmic Pulse (Heartbeat):** Tap a heart to send a real-time "pulse" to your partner, which triggers a vibration and a push notification on their device.
-   **Shared Countdown:** A persistent timer counts the duration of your "journey together in the cosmos" from a configurable start date.
-   **Status Signals:** Share your current mood (e.g., Happy, Miss You, Love You, Tired) which instantly updates on your partner's device.
-   **Cosmic Note:** A shared, synchronized notepad to leave messages for each other among the stars.
-   **Push Notifications:** A custom Node.js service listens for heartbeats and sends push notifications via Expo's services, ensuring your partner never misses a pulse.

---

## 🛠️ How It Works

The application consists of two main parts:

1.  **The Mobile Client (`/`):** A React Native application built with Expo. It handles the UI, user interactions, and communicates directly with Firebase Realtime Database to read and write shared state (mood, notes, etc.).
2.  **The Notification Service (`/server`):** A lightweight Node.js script that listens for a specific change in the Firebase database (the `heartTimestamp`). When a new heartbeat is detected, this service fetches all registered device tokens and sends a push notification through the Expo Push API.

This architecture allows for real-time, bidirectional data flow without requiring a complex, full-fledged backend server.

---

## 💻 Tech Stack

-   **Frontend:** React Native, Expo
-   **State Management:** React Hooks
-   **Backend & Realtime Sync:** Firebase Realtime Database
-   **Push Notifications:** Expo Push API, Node.js
-   **Styling:** Custom StyleSheet with `expo-linear-gradient` for the cosmic theme.

---

## 📂 Project Structure

```
.
├── App.js              # Main React Native application component and UI
├── app.json            # Expo configuration file
├── eas.json            # Expo Application Services (EAS) build configuration
├── package.json        # Project dependencies and scripts
└── server/
    └── notify.js       # Node.js script for sending push notifications
```

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS version)
-   [Expo Go](https://expo.dev/go) app installed on your physical Android or iOS device.
-   A Firebase project with the Realtime Database enabled.

### 1. Configure Firebase

The project uses hardcoded Firebase credentials in `App.js` and `server/notify.js`. For this project to work, you must replace the placeholder `firebaseConfig` object in both files with your own Firebase project's configuration.

> **Security Warning:** Do not commit your actual Firebase credentials to a public repository. These should be stored securely using environment variables for a production application.

### 2. Setup the Client

```bash
# Install dependencies
npm install

# Start the Metro bundler
npm start
```

Scan the QR code with the Expo Go app on your device.

### 3. Setup the Notification Service

The notification server runs separately.

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Start the notification listener
node notify.js
```

This service must be running to send push notifications for the "Pulse" feature.

---

## 📜 Available Scripts

-   `npm start`: Runs the app in development mode with Metro.
-   `npm run android`: Starts the app on a connected Android device or emulator.
-   `npm run ios`: Starts the app on an iOS simulator.
-   `npm run web`: Runs the app in a web browser.

---

## 📦 Building the APK

This project is configured to be built using Expo Application Services (EAS).

1.  **Install the EAS CLI:**
    ```bash
    npm install -g eas-cli
    ```

2.  **Log in to your Expo account:**
    ```bash
    eas login
    ```

3.  **Start the Android build:**
    The `eas.json` file is pre-configured to build an APK with the `preview` profile.
    ```bash
    eas build -p android --profile preview
    ```

EAS will manage the build process in the cloud. You can monitor the progress via the link provided in the terminal and download the APK once it's complete.