import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MessageCircleHeart, Image as ImageIcon, Pill, NotebookPen } from 'lucide-react-native';

import { Colors, Spacing, Layout, Typography } from '../theme';
import HeartStar from '../components/HeartStar';
import RelationshipCounter from '../components/RelationshipCounter';
import { HeartbeatService } from '../lib/services';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile } = useAuthStore();
  const [isSending, setIsSending] = useState(false);

  // Hardcoded start date for now as per spec
  const startDate = new Date('2025-03-23T00:00:00');

  const handleHeartbeat = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSending(true);

    // Simulate sending to partner
    const partner = profile === 'Illy' ? 'Mins' : 'Illy';
    await HeartbeatService.sendHeartbeat(profile || 'Unknown', partner);

    setTimeout(() => {
        setIsSending(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  };

  const NavButton = ({ icon: Icon, label, route }: { icon: any, label: string, route: keyof RootStackParamList }) => (
    <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate(route)}>
      <View style={styles.iconContainer}>
        <Icon color={Colors.Starlight} size={24} />
      </View>
      <Text style={styles.navLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.VoidBlack, Colors.DeepNight]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Section: Counter */}
      <View style={styles.topSection}>
        <RelationshipCounter startDate={startDate} />
      </View>

      {/* Center Section: HeartStar */}
      <View style={styles.centerSection}>
        <HeartStar onPress={handleHeartbeat} isSending={isSending} />
        <Text style={styles.instructionText}>
          {isSending ? 'Sending pulse...' : 'Tap to send a heartbeat'}
        </Text>
      </View>

      {/* Bottom Section: Navigation Grid */}
      <View style={styles.bottomSection}>
        <View style={styles.gridRow}>
          <NavButton icon={MessageCircleHeart} label="Check-In" route="BPDCheckIn" />
          <NavButton icon={ImageIcon} label="Locket" route="PhotoLocket" />
        </View>
        <View style={styles.gridRow}>
          <NavButton icon={NotebookPen} label="Notes" route="SharedNote" />
          <NavButton icon={Pill} label="Meds" route="Medication" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: Spacing.xl,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    flex: 1.5,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
  },
  instructionText: {
    ...Typography.Body,
    marginTop: Spacing.xl,
    color: Colors.Starlight,
    opacity: 0.5,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  navButton: {
    flex: 1,
    backgroundColor: 'rgba(42, 18, 56, 0.4)', // Semi-transparent ShadowPurple
    borderRadius: Layout.radius,
    padding: Spacing.m,
    marginHorizontal: Spacing.s,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 59, 111, 0.3)', // Faint StarBlue
  },
  iconContainer: {
    marginBottom: Spacing.s,
  },
  navLabel: {
    ...Typography.Body,
    fontSize: 12,
    color: Colors.Starlight,
    fontWeight: '600',
  },
});
