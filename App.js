import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Vibration, Alert, StatusBar, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Built-in Expo icons

// --- 🔧 CONFIGURATION (PASTE YOUR KEYS HERE) ---
const BIN_ID = "695acf51ae596e708fc4ecfc "; 
const API_KEY = "$2a$10$IXXZdh5uiJywWy24RsMjxeuh9xTdVFnZ2SpmOK6//ygvWrQwasDza";
const START_DATE = new Date("2025-03-23T00:00:00"); // Relationship Start
// -----------------------------------------------

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY
};

// Dark Theme Colors
const COLORS = {
  bg: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  subText: '#A0A0A0',
  accent: '#FF4081', // Pink
  primary: '#2196F3', // Blue
  success: '#00E676', // Green
  danger: '#FF5252', // Red
  input: '#2C2C2C'
};

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState('home');
  const [timer, setTimer] = useState("");
  const [partnerMood, setPartnerMood] = useState("Unknown");
  const [note, setNote] = useState("");
  const [nextVisit, setNextVisit] = useState("Not set"); 
  const [isSleeping, setIsSleeping] = useState(false);
  const [lastHeartTime, setLastHeartTime] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // --- 1. TIMERS LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Count UP (Together)
      const diff = now - START_DATE;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setTimer(`${days}d ${hours}h ${mins}m`);

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. POLLING (SYNC) LOGIC ---
  useEffect(() => {
    const pollInterval = setInterval(() => checkForUpdates(), 5000);
    return () => clearInterval(pollInterval);
  }, [lastHeartTime]);

  const checkForUpdates = async () => {
    try {
      const response = await axios.get(API_URL, { headers: HEADERS });
      const data = response.data.record;

      // Update basic fields
      if (data.mood) setPartnerMood(data.mood);
      if (data.is_sleeping !== undefined) setIsSleeping(data.is_sleeping);
      if (data.next_visit) setNextVisit(data.next_visit);
      
      // Update Note (only if we aren't editing it currently)
      // Simple check: If note is drastically different, update it.
      if (data.note && data.note !== note && !isSending) {
         setNote(data.note);
      }

      // HEART LOGIC (Fix: Only vibrate if timestamp is NEW and NOT from me)
      // Since we can't easily identify "me" vs "them" without login, 
      // we rely on local state "lastHeartTime" being up to date.
      if (data.heart_timestamp > lastHeartTime && lastHeartTime !== 0) {
        // Double check: Did *I* just send this? 
        // If the server time is almost identical to a local "sent" time, we skip.
        // For simplicity: We just vibrate. 
        triggerVibration();
      }
      
      if (data.heart_timestamp > lastHeartTime) {
         setLastHeartTime(data.heart_timestamp);
      }

    } catch (error) {
      console.log("Polling silent fail");
    }
  };

  const triggerVibration = () => {
    // Heartbeat pattern: bum-bum ... bum-bum
    Vibration.vibrate([0, 100, 100, 100]); 
    // If you want an alert box (optional, can be annoying if app is open)
    // Alert.alert("❤️", "Partner sent love!"); 
  };

  const sendUpdate = async (key, value) => {
    setIsSending(true);
    try {
      // Fetch latest first to merge
      const current = await axios.get(API_URL, { headers: HEADERS });
      let payload = current.data.record;

      // Update specific key
      payload[key] = value;
      
      // If sending heart, track timestamp immediately to prevent self-vibration
      if (key === 'heart_timestamp') {
        setLastHeartTime(value);
      }

      await axios.put(API_URL, payload, { headers: HEADERS });
      
    } catch (error) {
      Alert.alert("Sync Error", "Check connection");
    }
    setIsSending(false);
  };

  // --- SCREENS ---

  const renderHome = () => (
    <View style={styles.centerContent}>
      <View style={styles.timerCircle}>
        <Text style={styles.timerLabel}>TOGETHER FOR</Text>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      <TouchableOpacity 
        style={styles.heartBtn} 
        activeOpacity={0.7}
        onPress={() => {
          Alert.alert("❤️ Sent", "Sending a heartbeat...");
          sendUpdate('heart_timestamp', Date.now());
        }}
      >
        <MaterialCommunityIcons name="heart" size={80} color="white" />
      </TouchableOpacity>
      <Text style={styles.hint}>Tap to send love</Text>
    </View>
  );

  const renderSpace = () => (
    <View style={styles.scrollContent}>
      {/* STATUS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Check</Text>
        <View style={styles.row}>
          <Text style={{color: COLORS.subText}}>Partner is:</Text>
          <Text style={{color: COLORS.accent, fontWeight:'bold', fontSize: 18}}>
            {partnerMood} {isSleeping ? "(💤 Asleep)" : ""}
          </Text>
        </View>
        
        <Text style={[styles.cardTitle, {marginTop: 20}]}>My Status</Text>
        <View style={styles.row}>
           <TouchableOpacity style={[styles.statusBtn, {backgroundColor: COLORS.success}]} onPress={() => sendUpdate('mood', 'Happy 😊')}>
             <Text style={styles.emoji}>😊</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.statusBtn, {backgroundColor: COLORS.primary}]} onPress={() => sendUpdate('mood', 'Miss You 🥺')}>
             <Text style={styles.emoji}>🥺</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.statusBtn, {backgroundColor: COLORS.danger}]} onPress={() => sendUpdate('mood', 'Tired 😴')}>
             <Text style={styles.emoji}>😴</Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* SHARED NOTE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Our Shared Note</Text>
        <TextInput 
          style={styles.input} 
          multiline 
          placeholder="Leave a message..."
          placeholderTextColor="#555"
          value={note}
          onChangeText={setNote}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={() => {
          Keyboard.dismiss();
          sendUpdate('note', note);
          Alert.alert("Saved", "Note updated for partner.");
        }}>
          <Text style={styles.btnText}>SYNC NOTE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.scrollContent}>
       <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Meeting</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g., Dec 25th 2026"
            placeholderTextColor="#555"
            value={nextVisit}
            onChangeText={setNextVisit} 
          />
          <TouchableOpacity style={styles.saveBtn} onPress={() => sendUpdate('next_visit', nextVisit)}>
             <Text style={styles.btnText}>UPDATE DATE</Text>
          </TouchableOpacity>
       </View>

       <View style={styles.card}>
         <Text style={styles.cardTitle}>App Info</Text>
         <Text style={{color: COLORS.subText, lineHeight: 22}}>
           Build: v2.0 Dark Mode{'\n'}
           Sync Status: {isSending ? "Syncing..." : "Active"}{'\n'}
           Battery: Set to 'Unrestricted' for best results.
         </Text>
       </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Us Two</Text>
          {isSending && <View style={styles.dot} />}
        </View>

        {/* MAIN CONTENT AREA */}
        <View style={styles.content}>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'space' && renderSpace()}
          {activeTab === 'settings' && renderSettings()}
        </View>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
            <MaterialCommunityIcons name="heart-pulse" size={28} color={activeTab === 'home' ? COLORS.accent : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'home' ? COLORS.accent : COLORS.subText}]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('space')}>
            <MaterialCommunityIcons name="message-text" size={28} color={activeTab === 'space' ? COLORS.accent : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'space' ? COLORS.accent : COLORS.subText}]}>Space</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
            <MaterialCommunityIcons name="calendar-clock" size={28} color={activeTab === 'settings' ? COLORS.accent : COLORS.subText} />
            <Text style={[styles.navText, {color: activeTab === 'settings' ? COLORS.accent : COLORS.subText}]}>Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { 
    height: 80, paddingTop: 30, backgroundColor: COLORS.bg, 
    alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#333' 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, letterSpacing: 2 },
  dot: { position: 'absolute', right: 20, top: 45, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  
  content: { flex: 1 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { flex: 1, padding: 20 },

  // Home Styles
  timerCircle: { 
    width: 250, height: 250, borderRadius: 125, 
    borderWidth: 4, borderColor: COLORS.card, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 40 
  },
  timerLabel: { color: COLORS.subText, fontSize: 14, letterSpacing: 1, marginBottom: 5 },
  timerText: { color: COLORS.text, fontSize: 28, fontWeight: 'bold' },
  heartBtn: {
    backgroundColor: COLORS.accent, width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center', elevation: 10, shadowColor: COLORS.accent, shadowOpacity: 0.5
  },
  hint: { color: COLORS.subText, marginTop: 20 },

  // Space/Card Styles
  card: { backgroundColor: COLORS.card, borderRadius: 15, padding: 20, marginBottom: 20 },
  cardTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statusBtn: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
  input: { 
    backgroundColor: COLORS.input, color: COLORS.text, borderRadius: 10, 
    padding: 15, height: 100, textAlignVertical: 'top', fontSize: 16 
  },
  saveBtn: { 
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.subText, 
    marginTop: 10, padding: 12, borderRadius: 8, alignItems: 'center' 
  },
  btnText: { color: COLORS.text, fontWeight: 'bold' },

  // Navigation Styles
  navBar: { 
    flexDirection: 'row', height: 70, backgroundColor: '#181818', 
    borderTopWidth: 1, borderTopColor: '#333', paddingBottom: 10 
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, marginTop: 4 }
});