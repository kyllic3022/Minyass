# Minyass (Darlen-ls)

This is the repository for the **Minyass** app (codenamed Darlen-ls), a private React Native application built with Expo for Android.

## Prerequisites for Windows

To run and build this application on Windows, you need to set up your development environment.

### 1. Install Node.js
Download and install the latest LTS version of Node.js from [nodejs.org](https://nodejs.org/).
*   Verify installation by running `node -v` and `npm -v` in PowerShell or Command Prompt.

### 2. Install Git
Download and install Git from [git-scm.com](https://git-scm.com/).

### 3. Install Java (OpenJDK)
Expo and Android require Java.
*   We recommend installing **OpenJDK 17**. You can get it from [Microsoft's OpenJDK builds](https://learn.microsoft.com/en-us/java/openjdk/download) or [Adoptium](https://adoptium.net/).
*   **Important:** Set the `JAVA_HOME` environment variable to your JDK installation path.
    *   Search for "Edit the system environment variables" in Windows Search.
    *   Click "Environment Variables".
    *   Under "System variables", click "New".
    *   Name: `JAVA_HOME`
    *   Value: Path to your JDK (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17...`).

### 4. Setup Android Environment (For Emulator)
If you want to run the app on an emulator on your PC:
1.  Download and install [Android Studio](https://developer.android.com/studio).
2.  During installation, ensure **Android Virtual Device** is selected.
3.  Open Android Studio, go to **Device Manager**, and create a new virtual device (e.g., Pixel 6).
4.  Set the `ANDROID_HOME` environment variable:
    *   Default path is usually `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`.

### 5. Install Expo CLI
Install the Expo CLI globally (optional, but useful):
```powershell
npm install -g eas-cli
```

---

## Installation

1.  Clone the repository (if you haven't already):
    ```powershell
    git clone <repository-url>
    cd minyass
    ```

2.  Install dependencies:
    ```powershell
    npm install
    ```

---

## Running the App

### Option A: Run on Physical Android Device (Recommended)
This is the easiest way to test.
1.  Install the **Expo Go** app from the Google Play Store on your Android phone.
2.  Ensure your phone and PC are on the **same Wi-Fi network**.
3.  Start the development server:
    ```powershell
    npx expo start
    ```
4.  A QR code will appear in the terminal.
5.  Open Expo Go on your phone and scan the QR code.

### Option B: Run on Android Emulator
1.  Start your Android Emulator via Android Studio.
2.  Start the development server:
    ```powershell
    npx expo start
    ```
3.  Press `a` in the terminal to open the app on the connected Android emulator.

---

## Building the App (APK)

To build a standalone APK file that you can install manually on your device:

1.  **Login to Expo:**
    ```powershell
    eas login
    ```

2.  **Configure Build:**
    The project is already configured with `eas.json`.

3.  **Run the Build:**
    To build an APK for Android:
    ```powershell
    eas build -p android --profile preview
    ```

4.  **Download:**
    Once the build finishes (it runs in the cloud), EAS will provide a link to download the `.apk` file. You can install this on your Android device.

---

## Troubleshooting

*   **" 'npx' is not recognized..."**: Ensure Node.js is installed and added to your PATH. Restart your terminal.
*   **"System limit for number of file watchers reached"**: This is common. Follow instructions [here](https://facebook.github.io/watchman/docs/install#windows) if you encounter file watching errors, though usually less of an issue on Windows compared to Linux.
*   **Network Errors**: If your phone cannot connect to the server, ensure your Windows Firewall is allowing Node.js to accept connections, or try using a Tunnel connection:
    ```powershell
    npx expo start --tunnel
    ```
