import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../theme';

export default function SharedNoteScreen() {
  const [text, setText] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock syncing
  useEffect(() => {
    // In a real app, listen to Firestore document
    setText("This is our shared space.\n\nWe can write anything here...");
  }, []);

  const handleChange = (newText: string) => {
    setText(newText);
    setLastUpdated(new Date());
    // Debounce save to Firestore
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.status}>
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Synced'}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={handleChange}
        placeholder="Write something..."
        placeholderTextColor="rgba(232, 230, 240, 0.3)"
        autoFocus
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
  },
  header: {
    padding: Spacing.s,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Colors.ShadowPurple,
  },
  status: {
    ...Typography.Body,
    fontSize: 10,
    color: Colors.Starlight,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    padding: Spacing.m,
    color: Colors.Starlight,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
});
