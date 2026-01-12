// server/notify.js
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, get } = require("firebase/database");
const fetch = require('node-fetch');

// --- FIREBASE CONFIGURATION (SAME AS CLIENT) ---
const firebaseConfig = {
  apiKey: "AIzaSyBAUlgxwgu-IUJ4cMP22JxZe_qStAEWWrc",
  authDomain: "minyass-93949.firebaseapp.com",
  databaseURL: "https://minyass-93949-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "minyass-93949",
  storageBucket: "minyass-93949.firebasestorage.app",
  messagingSenderId: "970786227314",
  appId: "1:970786227314:web:066cac7b3d75dd4532eeeb",
  measurementId: "G-WQEL3FQQPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let lastHeartTime = 0;

console.log("💜 Cosmic Notification Bridge Started...");
console.log("   Listening for love signals from the stars...");

const dataRef = ref(db, 'minyass');

// Listen for updates
onValue(dataRef, async (snapshot) => {
  const data = snapshot.val();

  if (!data) return;

  // Initial check or fresh load
  if (lastHeartTime === 0) {
    lastHeartTime = data.heartTimestamp || 0;
    return;
  }

  // CHECK: Is this a new heart?
  if (data.heartTimestamp && data.heartTimestamp > lastHeartTime) {
    console.log(`\n❤️ Heartbeat detected! (Time: ${new Date(data.heartTimestamp).toLocaleTimeString()})`);

    // Update local tracker
    lastHeartTime = data.heartTimestamp;

    // Send Push Notifications
    await sendPushNotifications();
  }
});

async function sendPushNotifications() {
  try {
    // 1. Get all stored tokens
    const tokensSnapshot = await get(ref(db, 'minyass/tokens'));
    const tokensMap = tokensSnapshot.val();

    if (!tokensMap) {
      console.log("   ⚠️ No devices registered for notifications yet.");
      return;
    }

    const tokens = Object.values(tokensMap).map(t => t.token);
    console.log(`   📲 Sending push to ${tokens.length} devices...`);

    // 2. Format messages for Expo Push API
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title: '❤️ LoveSync',
      body: 'Partner sent some love!',
      data: { someData: 'goes here' },
      channelId: 'default', // Android requirement
    }));

    // 3. Send to Expo
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const receipt = await response.json();
    console.log("   ✅ Push Status:", receipt.data ? receipt.data.status : receipt);

  } catch (error) {
    console.error("   ❌ Error sending push:", error);
  }
}
