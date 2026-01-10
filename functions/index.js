const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

exports.sendHeartbeatPush = functions.database
  .ref("minyass/heartTimestamp")
  .onWrite(async (change) => {
    const before = change.before.val() || 0;
    const after = change.after.val() || 0;

    if (!after || after <= before) {
      return null;
    }

    const db = admin.database();
    const senderTokenSnap = await db.ref("minyass/heartSenderToken").get();
    const senderToken = senderTokenSnap.val();

    const tokensSnapshot = await db.ref("minyass/tokens").get();
    if (!tokensSnapshot.exists()) {
      console.log("No devices registered for notifications yet.");
      return null;
    }

    const tokens = [];
    tokensSnapshot.forEach((child) => {
      const value = child.val();
      if (value && value.token) {
        tokens.push(value.token);
      }
    });

    const targetTokens = senderToken
      ? tokens.filter((token) => token !== senderToken)
      : tokens;

    if (!targetTokens.length) {
      console.log("No target devices after filtering sender.");
      return null;
    }

    const messages = targetTokens.map((token) => ({
      to: token,
      sound: "default",
      title: "LoveSync",
      body: "Partner sent some love!",
      data: { type: "heartbeat", timestamp: after },
      channelId: "default"
    }));

    const chunks = chunkArray(messages, 100);
    for (const chunk of chunks) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(chunk)
      });

      const result = await response.json();
      console.log("Expo push result:", result);
    }

    return null;
  });
