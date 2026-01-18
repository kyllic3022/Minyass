import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Colors, Typography, Spacing } from '../theme';

interface RelationshipCounterProps {
  startDate: Date;
}

export default function RelationshipCounter({ startDate }: RelationshipCounterProps) {
  const [time, setTime] = useState(calculateTime(startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTime(startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  function calculateTime(start: Date) {
    const now = new Date();
    const days = differenceInDays(now, start);
    const hours = differenceInHours(now, start) % 24;
    const minutes = differenceInMinutes(now, start) % 60;
    const seconds = differenceInSeconds(now, start) % 60;
    return { days, hours, minutes, seconds };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </Text>
      <Text style={styles.label}>of connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.m,
  },
  counterText: {
    ...Typography.Body,
    fontSize: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: Colors.Starlight,
    letterSpacing: 1,
  },
  label: {
    ...Typography.Body,
    fontSize: 12,
    color: Colors.Starlight,
    opacity: 0.5,
    marginTop: Spacing.xs,
  },
});
