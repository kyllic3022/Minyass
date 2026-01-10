# Minyass 🚀

Minyass is a cosmic-themed mobile application built with React Native and Expo, designed for partners to stay connected in a shared digital space. It uses Firebase Realtime Database for instant synchronization and a Node.js-based notifier to send push notifications, creating a sense of presence even when apart.

![Cosmic Theme](https://i.imgur.com/placeholder.png "A placeholder image showing a cosmic-themed app interface")
_(App interface has a dark, space-like background with neon text and icons.)_

---

## ✨ Core Features

- **Cosmic Pulse (Heartbeat):** Tap a heart to send a real-time "pulse" to your partner, which triggers a vibration and a push notification on their device.
- **Shared Countdown:** A persistent timer counts the duration of your "journey together in the cosmos" from a configurable start date.
- **Status Signals:** Share your current mood (e.g., Happy, Miss You, Love You, Tired) which instantly updates on your partner's device.
- **Cosmic Note:** A shared, synchronized notepad to leave messages for each other among the stars.
- **Push Notifications:** A custom Node.js service listens for heartbeats and sends push notifications via Expo's services, ensuring your partner never misses a pulse.

---

## 🛠️ How It Works

The application consists of two main parts:

1.  **The Mobile Client (`/`):** A React Native application built with Expo. It handles the UI, user interactions, and communicates directly with Firebase Realtime Database to read and write shared state (mood, notes, etc.).
2.  **The Notification Service (`/functions`):** A Firebase Cloud Function that listens for changes to `heartTimestamp`. When a new heartbeat is detected, it fetches all registered device tokens and sends a push notification through the Expo Push API. This runs in the cloud, so notifications work when the app is backgrounded or killed.

This architecture allows for real-time, bidirectional data flow without requiring a complex, full-fledged backend server.

---

## 💻 Tech Stack

- **Frontend:** React Native, Expo
- **State Management:** React Hooks
- **Backend & Realtime Sync:** Firebase Realtime Database
- **Push Notifications:** Expo Push API, Node.js
- **Styling:** Custom StyleSheet with `expo-linear-gradient` for the cosmic theme.

---

## 📂 Project Structure

```
.
├── App.js              # Main React Native application component and UI
├── app.json            # Expo configuration file
├── eas.json            # Expo Application Services (EAS) build configuration
├── firebase.json       # Firebase CLI configuration
├── package.json        # Project dependencies and scripts
├── functions/
    ├── index.js        # Firebase Cloud Function for push notifications
    ├── package.json    # Function dependencies
└── server/
    └── notify.js       # Node.js script for sending push notifications
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- [Expo Go](https://expo.dev/go) app installed on your physical Android or iOS device.
- A Firebase project with the Realtime Database enabled.

### 1. Configure Firebase

The project uses hardcoded Firebase credentials in `App.js`, `server/notify.js`, and `functions/index.js`. For this project to work, you must replace the placeholder `firebaseConfig` object in both files with your own Firebase project's configuration.

> **Security Warning:** Do not commit your actual Firebase credentials to a public repository. These should be stored securely using environment variables for a production application.

### 2. Setup the Client

```bash
# Install dependencies
npm install

# Start the Metro bundler
npm start
```

Scan the QR code with the Expo Go app on your device.

### 3. Setup the Notification Service (Recommended: Cloud Functions)

This service runs in the cloud so it can send notifications even when the app is locked or closed.

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Link this repo to your Firebase project
firebase login
firebase use --add

# Deploy the function
cd functions
npm install
cd ..
firebase deploy --only functions
```

Once deployed, the function will send push notifications for the "Pulse" feature.

### 4. Local Notification Service (Optional)

If you want a local dev alternative, you can still run the Node.js listener:

```bash
cd server
npm install
node notify.js
```

This must stay running to send pushes, so it is not reliable for production.

---

## 📜 Available Scripts

- `npm start`: Runs the app in development mode with Metro.
- `npm run android`: Starts the app on a connected Android device or emulator.
- `npm run ios`: Starts the app on an iOS simulator.
- `npm run web`: Runs the app in a web browser.

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
