# 🧠 Project Brainstorming: Minyass / LoveSync

**Date:** October 2023 (Simulated Start)
**Participants:** User & AI Agent
**Goal:** Define the scope, technical architecture, and design for a Long-Distance Relationship (LDR) synchronization app.

---

## 1. The Core Vision
**"How can we feel connected instantly, without typing a message?"**

Standard messaging apps (WhatsApp, Telegram) are great for conversation, but they require active engagement. We need something passive, visceral, and emotional.

*   **The Metaphor:** A "quantum entanglement" between two phones. When one changes state, the other changes instantly.
*   **The Feeling:** Not "I am texting you," but "I am thinking of you right now."

## 2. Feature Exploration

### The "Must-Haves" (MVP)
*   **The Heartbeat:** A single giant button. Tapping it sends a vibration/pulse to the partner immediately.
*   **Together Timer:** A counter showing exactly how long we've been together (Days, Hours, Minutes, Seconds). Seeing the number go up feels like progress.
*   **Status/Mood Beacon:** A simple way to say "I'm Asleep," "I'm Busy," or "I Miss You" without starting a chat.
*   **Shared Canvas/Note:** A sticky note that updates in real-time. Good for leaving cute messages for the other person to wake up to.

### The "Nice-to-Haves" (Future)
*   **Lock Screen Widgets:** See the countdown or the last sent heart without unlocking the phone.
*   **Weather Sync:** "Is it raining where you are?" Displaying the partner's weather next to yours.
*   **Photo Locket:** A widget that shows a random photo of us.
*   **Music Sync:** Listening to Spotify together? (Technically complex, maybe later).

## 3. Technical Constraints & Architecture

### Platform Choice
*   **React Native (Expo):**
    *   *Pros:* Single codebase for iOS/Android, fast development, "Expo Go" makes testing easy.
    *   *Cons:* Some native modules (like specialized background tasks) can be tricky without "ejecting" or using Development Builds.
    *   *Decision:* **Stick with Expo.** It's the path of least resistance.

### Backend & Sync
*   **Option A: Polling (JSONBin / Simple API)**
    *   *Pros:* Dead simple, free, no setup.
    *   *Cons:* Slow (5-second delay), drains battery, "race conditions" (we overwrite each other's data).
*   **Option B: WebSockets (Socket.io)**
    *   *Pros:* Instant.
    *   *Cons:* Requires hosting a server (Heroku/DigitalOcean), maintaining connections is hard.
*   **Option C: Firebase Realtime Database**
    *   *Pros:* Instant, handles "offline" syncing, Free Tier is generous, integrates well with mobile.
    *   *Decision:* **Firebase.** It solves the "overwrite" issue and gives us that "magic" instant feeling.

### The "Background" Problem
*   *Challenge:* When the app is closed (or phone locked), the code stops running. We can't "listen" for a heartbeat.
*   *Solution:* **Push Notifications.**
    *   We need a way to trigger a system notification.
    *   Since we are avoiding a complex backend, we might need a "Bridge Script" running on a computer, or eventually upgrade to Firebase Cloud Functions to watch the database and send the ping.

## 4. Design Language
**Theme:** "Cosmic / Deep Space"
*   **Why?** Distance feels like space. You are my star in the darkness.
*   **Colors:** Deep blacks (`#0B0D17`), Void Purples, Neon Pinks/Cyans.
*   **Feel:** Glassmorphism (translucent cards), glowing effects, smooth/slow animations (breathing/pulsing).

## 5. Next Steps (Action Plan)
1.  Initialize Expo project.
2.  Set up Firebase project (Web SDK).
3.  Build the "Heart" component with React Native Animations.
4.  Implement the Push Notification bridge logic.
