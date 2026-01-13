import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../theme';
import { Sun, Moon, CheckCircle } from 'lucide-react-native';

export default function MedicationScreen() {
  const [amTaken, setAmTaken] = useState(false);
  const [pmTaken, setPmTaken] = useState(false);

  const MedCard = ({ time, taken, onToggle, icon: Icon }: any) => (
    <View style={[styles.card, taken && styles.cardTaken]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon color={taken ? Colors.Starlight : Colors.StarBlue} size={24} />
          <Text style={styles.timeLabel}>{time} Dose</Text>
        </View>
        <Switch
          value={taken}
          onValueChange={onToggle}
          trackColor={{ false: Colors.ShadowPurple, true: Colors.StarBlue }}
          thumbColor={Colors.Starlight}
        />
      </View>
      <Text style={styles.details}>100mg Lamotrigine</Text>
      {taken && (
        <View style={styles.takenBadge}>
          <CheckCircle size={14} color={Colors.Starlight} />
          <Text style={styles.takenText}>Taken</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Meds</Text>

      <MedCard
        time="Morning"
        taken={amTaken}
        onToggle={setAmTaken}
        icon={Sun}
      />

      <MedCard
        time="Evening"
        taken={pmTaken}
        onToggle={setPmTaken}
        icon={Moon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
    padding: Spacing.m,
  },
  title: {
    ...Typography.Headings,
    fontSize: 24,
    color: Colors.Starlight,
    marginBottom: Spacing.l,
  },
  card: {
    backgroundColor: Colors.DeepNight,
    borderRadius: Layout.radius,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.ShadowPurple,
  },
  cardTaken: {
    borderColor: Colors.StarBlue,
    backgroundColor: 'rgba(46, 59, 111, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  timeLabel: {
    ...Typography.Body,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.Starlight,
  },
  details: {
    ...Typography.Body,
    fontSize: 14,
    color: Colors.Starlight,
    opacity: 0.7,
  },
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.s,
    gap: 4,
  },
  takenText: {
    ...Typography.Body,
    fontSize: 12,
    color: Colors.Starlight,
    fontWeight: '600',
  },
});
