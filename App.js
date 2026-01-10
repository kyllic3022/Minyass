import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Vibration, StatusBar, Keyboard, TouchableWithoutFeedback, Animated, Alert, Platform, AppState
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";

// --- FIREBASE CONFIGURATION ---
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

// --- NOTIFICATIONS CONFIG ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- COSMIC THEME COLORS ---
const COLORS = {
  bgStart: '#0B0D17', // Deep Space Black
  bgEnd: '#240b36',   // Deep Cosmic Purple
  cardBg: 'rgba(30, 30, 40, 0.7)', // Glassmorphism
  text: '#E0E0E0',
  subText: '#A0A0A0',
  accent: '#FF007F', // Neon Pink
  primary: '#00F0FF', // Neon Cyan
  success: '#00E676', // Neon Green
  danger: '#FF5252', // Neon Red
  input: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.1)'
};

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState('home');
  const [timer, setTimer] = useState("");
  const [partnerMood, setPartnerMood] = useState("Unknown");
  const [note, setNote] = useState("");
  const [startDate, setStartDate] = useState(new Date("2025-03-23T00:00:00"));

  // Local Input State for Settings (prevents jumping while typing)
  const [dateInput, setDateInput] = useState(startDate.toISOString());

  const [lastHeartTime, setLastHeartTime] = useState(0); // For rendering/state
  const [isSending, setIsSending] = useState(false);

  // Refs for logic to avoid re-renders or effect dependency loops
  const lastHeartTimeRef = useRef(0);
  const pushTokenRef = useRef(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- 0. REGISTER PUSH TOKEN ---
  useEffect(() => {
    let isMounted = true;

    const upsertPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      if (!token || !isMounted) return;

      // Save token to Firebase under "users"
      const cleanToken = token.replace(/[.#$\/[\]]/g, "_"); // sanitize key if needed (though standard push tokens are usually safe values, using the token itself as key can be long, better to just push it to a list or use device ID)

      // Simpler approach: Just store it under a generated ID or device ID
      // Since we don't have auth, we'll just push it to a "tokens" list
      // Note: In a real app, you'd associate this with a User ID.
      // Here we just want to broadcast to "everyone else".
      const tokenRef = ref(db, `minyass/tokens/${cleanToken}`);
      await update(tokenRef, {
        token: token,
        lastSeen: Date.now()
      });
      pushTokenRef.current = token;

    };

    upsertPushToken();

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        upsertPushToken();
      }
    });

    return () => {
      isMounted = false;
      appStateSub.remove();
    };
  }, []);

  // --- 1. SETUP & LISTENER ---
  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();

    // Start Heartbeat Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Firebase Listener
    const dataRef = ref(db, 'minyass');
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.mood) setPartnerMood(data.mood);
        if (data.note) setNote(data.note);

        if (data.startDate) {
          const newDate = new Date(data.startDate);
          setStartDate(newDate);
          // Only update input if it's not focused/being edited (simplified: just update it)
          // Ideally check focus, but for now we sync it to ensure consistency
          setDateInput(newDate.toISOString());
        }

        // Heartbeat Logic using Ref to prevent re-subscription
        if (data.heartTimestamp && data.heartTimestamp > lastHeartTimeRef.current) {
          // If this is the VERY first load (lastHeartTimeRef is 0), don't vibrate.
          // Or if the timestamp is fresh (within last 10 seconds), vibrate.
          const isFresh = (Date.now() - data.heartTimestamp) < 10000;

          if (lastHeartTimeRef.current !== 0 && isFresh) {
             triggerVibration();
          }
          lastHeartTimeRef.current = data.heartTimestamp;
          setLastHeartTime(data.heartTimestamp);
        }
      } else {
        // Initialize if empty
        update(ref(db, 'minyass'), {
          mood: "Waiting...",
          note: "Welcome to our cosmic space.",
          startDate: "2025-03-23T00:00:00",
          heartTimestamp: 0,
          heartSenderToken: ""
        });
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures stable listener

  // --- 2. TIMER LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - startDate;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimer(`${days}d ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimer("Soon...");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const triggerVibration = async () => {
    Vibration.vibrate([0, 100, 100, 100]); // Heartbeat pattern

    // Show Local Notification (still useful if app is foreground/background but running)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "❤️ LoveSync",
        body: "Partner sent some love!",
        sound: true,
      },
      trigger: null,
    });
  };

  const sendUpdate = (key, value) => {
    setIsSending(true);
    const updates = {};
    updates[key] = value;

    // If sending heart, update local timestamp too to avoid self-notification race
    if (key === 'heartTimestamp') {
      lastHeartTimeRef.current = value;
      setLastHeartTime(value);
      if (pushTokenRef.current) {
        updates.heartSenderToken = pushTokenRef.current;
      }
      // Visual feedback
      Alert.alert("❤️ Sent", "Your love is travelling through space...");
    }

    update(ref(db, 'minyass'), updates)
      .then(() => setIsSending(false))
      .catch((err) => {
        console.error(err);
        setIsSending(false);
      });
  };

  // --- HELPER: REGISTER FOR PUSH ---
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission needed', 'Failed to get push token for push notification!');
        return;
      }
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        Constants.easConfig?.projectId;
      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();
      token = tokenResponse.data;
      console.log("Expo Push Token:", token);
    } else {
      // Alert.alert('Notice', 'Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  // --- RENDERERS ---

  const renderHome = () => (
    <View style={styles.centerContent}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>TOGETHER IN THE COSMOS</Text>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => sendUpdate('heartTimestamp', Date.now())}
      >
        <Animated.View style={[styles.heartBtn, { transform: [{ scale: pulseAnim }] }]}>
           <MaterialCommunityIcons name="heart" size={80} color="white" />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.hint}>Tap to send a pulse</Text>
    </View>
  );

  const renderSpace = () => (
    <View style={styles.scrollContent}>
      {/* STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Signal</Text>
        <View style={styles.row}>
          <Text style={{color: COLORS.subText}}>Current Mood:</Text>
          <Text style={{color: COLORS.primary, fontWeight:'bold', fontSize: 18, textShadowColor: COLORS.primary, textShadowRadius: 10}}>
            {partnerMood}
          </Text>
        </View>
        
        <Text style={[styles.cardTitle, {marginTop: 25}]}>Broadcast Status</Text>
        <View style={styles.row}>
           <TouchableOpacity style={[styles.statusBtn, {borderColor: COLORS.success}]} onPress={() => sendUpdate('mood', 'Happy 😊')}>
             <Text style={styles.emoji}>😊</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.statusBtn, {borderColor: COLORS.primary}]} onPress={() => sendUpdate('mood', 'Miss You 🥺')}>
             <Text style={styles.emoji}>🥺</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.statusBtn, {borderColor: COLORS.accent}]} onPress={() => sendUpdate('mood', 'Love You ❤️')}>
             <Text style={styles.emoji}>❤️</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.statusBtn, {borderColor: COLORS.danger}]} onPress={() => sendUpdate('mood', 'Tired 😴')}>
             <Text style={styles.emoji}>😴</Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* SHARED NOTE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cosmic Note</Text>
        <TextInput 
          style={styles.input} 
          multiline 
          placeholder="Leave a message in the stars..."
          placeholderTextColor="#666"
          value={note}
          onChangeText={(text) => {
             setNote(text); // Local update
          }}
          onEndEditing={() => sendUpdate('note', note)} // Sync on finish
        />
        <Text style={styles.tinyText}>Auto-syncs when you finish typing</Text>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.scrollContent}>
       <View style={styles.card}>
          <Text style={styles.cardTitle}>Timeline</Text>
          <Text style={{color: COLORS.subText, marginBottom: 10}}>Start Date (ISO Format):</Text>
          <TextInput 
            style={styles.input} 
            placeholder="YYYY-MM-DDTHH:mm:ss"
            placeholderTextColor="#555"
            value={dateInput}
            onChangeText={setDateInput} // Only updates local state
            onEndEditing={() => {
              // Validate and Send
              try {
                const d = new Date(dateInput);
                if (!isNaN(d.getTime())) {
                   sendUpdate('startDate', dateInput);
                   setStartDate(d); // Optimistic update
                } else {
                   Alert.alert("Invalid Date", "Please use format YYYY-MM-DD");
                   setDateInput(startDate.toISOString()); // Revert
                }
              } catch (e) {
                 setDateInput(startDate.toISOString()); // Revert
              }
            }}
          />
          <Text style={styles.tinyText}>Tap outside to save.</Text>
       </View>

       <View style={styles.card}>
         <Text style={styles.cardTitle}>System</Text>
         <Text style={{color: COLORS.subText, lineHeight: 22}}>
           Connection: {isSending ? "Transmitting..." : "Stable"}{'\n'}
           Version: Cosmic v1.0{'\n'}
           Theme: Deep Space
         </Text>
       </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={[COLORS.bgStart, COLORS.bgEnd]}
          style={styles.background}
        />
        
        {/* HEADER */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Minyass</Text>
          {isSending && <View style={styles.dot} />}
        </Animated.View>

        {/* MAIN CONTENT AREA */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'space' && renderSpace()}
          {activeTab === 'settings' && renderSettings()}
        </Animated.View>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
            <MaterialCommunityIcons name="heart-pulse" size={28} color={activeTab === 'home' ? COLORS.accent : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'home' ? COLORS.accent : COLORS.subText}]}>Pulse</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('space')}>
            <MaterialCommunityIcons name="rocket-launch" size={28} color={activeTab === 'space' ? COLORS.primary : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'space' ? COLORS.primary : COLORS.subText}]}>Space</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
            <MaterialCommunityIcons name="cog" size={28} color={activeTab === 'settings' ? COLORS.text : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'settings' ? COLORS.text : COLORS.subText}]}>Config</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  header: { 
    height: 90, paddingTop: 40,
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.border
  },
  headerTitle: {
    fontSize: 24, fontWeight: 'bold', color: COLORS.text, letterSpacing: 4,
    textShadowColor: COLORS.accent, textShadowRadius: 10
  },
  dot: { position: 'absolute', right: 20, top: 55, width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  
  content: { flex: 1 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { flex: 1, padding: 20 },

  // Home Styles
  timerContainer: {
    alignItems: 'center', marginBottom: 60,
    backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border
  },
  timerLabel: { color: COLORS.primary, fontSize: 12, letterSpacing: 2, marginBottom: 10, fontWeight: 'bold' },
  timerText: { color: COLORS.text, fontSize: 32, fontWeight: '300', fontVariant: ['tabular-nums'] },

  heartBtn: {
    backgroundColor: COLORS.accent, width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent, shadowOpacity: 0.8, shadowRadius: 20, elevation: 20,
    borderWidth: 2, borderColor: '#fff'
  },
  hint: { color: COLORS.subText, marginTop: 30, letterSpacing: 1 },

  // Space/Card Styles
  card: {
    backgroundColor: COLORS.cardBg, borderRadius: 20, padding: 25, marginBottom: 25,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20,
  },
  cardTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 },
  statusBtn: {
    width: 65, height: 65, borderRadius: 32.5, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1
  },
  emoji: { fontSize: 28 },
  input: {
    backgroundColor: COLORS.input, color: COLORS.text, borderRadius: 15,
    padding: 15, fontSize: 16, borderWidth: 1, borderColor: COLORS.border
  },
  tinyText: { color: COLORS.subText, fontSize: 10, marginTop: 8, textAlign: 'right' },

  // Navigation Styles
  navBar: { 
    flexDirection: 'row', height: 80, backgroundColor: 'rgba(11, 13, 23, 0.95)',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 20, paddingTop: 10
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 10, marginTop: 4, fontWeight: 'bold', letterSpacing: 1 }
});
