# Minyass - Cosmic LoveSync

A real-time relationship synchronization app built with **React Native (Expo)** and **Firebase Realtime Database**.

## ✨ Features
*   **Real-time Heartbeats:** Instant pulse notifications when your partner taps the heart.
*   **Cosmic Theme:** Deep space design with animated pulsing hearts and neon accents.
*   **Shared Space:** Sync moods (`Happy`, `Miss You`, etc.) and write shared notes.
*   **Together Timer:** Tracks the exact time since your relationship started.
*   **Remote Config:** Change the relationship start date directly from the app.

## 🚀 Getting Started on Windows

Follow these steps to run the project on your Windows machine.

### 1. Prerequisites
Before you begin, ensure you have the following installed:

*   **Node.js (LTS Version):** Download from [nodejs.org](https://nodejs.org/).
    *   *Verify:* Open Command Prompt (cmd) or PowerShell and type `node -v` and `npm -v`.
*   **Git:** Download from [git-scm.com](https://git-scm.com/).
*   **Expo Go App:** Download this app on your physical phone (Android or iOS) from the App Store or Play Store.

### 2. Installation

1.  **Clone or Download** this project to your folder.
2.  Open **PowerShell** or **Command Prompt** in the project folder.
3.  Install dependencies:
    ```powershell
    npm install
    ```

### 3. Running the App

1.  Start the development server:
    ```powershell
    npx expo start
    ```
2.  You will see a **QR Code** in the terminal.
3.  **On your Phone:**
    *   Open the **Expo Go** app.
    *   Scan the QR code (on Android, use the Expo app's scanner; on iOS, use the standard Camera app).
    *   The app will load on your phone!

### 🔧 Troubleshooting on Windows

*   **"System cannot find the file specified"**: Ensure Node.js is in your PATH. Restart your computer after installing Node.
*   **Firewall Popups**: Allow Node.js to access private networks if Windows Firewall asks.
*   **Metro Bundler Issues**: If the app doesn't load, try running with the tunnel connection:
    ```powershell
    npx expo start --tunnel
    ```

## 📱 Tech Stack
*   **Frontend:** React Native, Expo
*   **Backend:** Firebase Realtime Database
*   **Styling:** Expo Linear Gradient, Animated API
*   **Notifications:** Expo Notifications

---
*Built with ❤️ for long-distance connection.*
