import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../theme';
import { Check, Send } from 'lucide-react-native';

const TRIGGERS = [
  "Fear of abandonment",
  "Dissociation thoughts",
  "Body image issues",
  "Feeling distant from you",
  "Feeling uncontrollable emotions",
  "Feeling like an upcoming breakdown",
  "Feelings of emptiness",
  "Feelings of hopelessness",
  "Rejection sensitivity",
  "Overthinking",
  "Past trauma memories",
  "Stress so overwhelming"
];

const NEEDS = [
  "Need reassurance",
  "Need space",
  "Need to deep breathe with you",
  "Need grounding (5-4-3-2-1)",
  "Need to videocall",
  "Need active listening",
  "Need emotions validated",
  "Silent presence",
  "Naming emotions together"
];

export default function BPDCheckInScreen() {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = () => {
    if (selectedTriggers.length === 0 && selectedNeeds.length === 0 && !note) {
      Alert.alert("Empty Check-in", "Please select at least one item or write a note.");
      return;
    }
    // Mock submission
    Alert.alert("Sent", "Your check-in has been sent to your partner.");
    setSelectedTriggers([]);
    setSelectedNeeds([]);
    setNote('');
  };

  const Section = ({ title, items, selected, onSelect }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.chipContainer}>
        {items.map((item: string) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              selected.includes(item) && styles.chipSelected
            ]}
            onPress={() => onSelect(item)}
          >
            <Text style={[
              styles.chipText,
              selected.includes(item) && styles.chipTextSelected
            ]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>BPD Check-In</Text>
        <Text style={styles.subHeader}>Share what you're feeling and what you need right now.</Text>

        <Section
          title="I'm feeling triggered by..."
          items={TRIGGERS}
          selected={selectedTriggers}
          onSelect={(item: string) => toggleSelection(item, selectedTriggers, setSelectedTriggers)}
        />

        <Section
          title="I need..."
          items={NEEDS}
          selected={selectedNeeds}
          onSelect={(item: string) => toggleSelection(item, selectedNeeds, setSelectedNeeds)}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optional Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Anything else?"
            placeholderTextColor="rgba(232, 230, 240, 0.3)"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Send to Partner</Text>
          <Send color={Colors.Starlight} size={20} style={{ marginLeft: Spacing.s }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
  },
  scrollContent: {
    padding: Spacing.m,
    paddingBottom: 100,
  },
  header: {
    ...Typography.Headings,
    fontSize: 28,
    color: Colors.Starlight,
    marginBottom: Spacing.xs,
  },
  subHeader: {
    ...Typography.Body,
    fontSize: 14,
    color: Colors.Starlight,
    opacity: 0.7,
    marginBottom: Spacing.l,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.Body,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.Starlight,
    marginBottom: Spacing.m,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  chip: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: 20,
    backgroundColor: Colors.DeepNight,
    borderWidth: 1,
    borderColor: Colors.ShadowPurple,
  },
  chipSelected: {
    backgroundColor: Colors.BordoRed,
    borderColor: Colors.EmberRed,
  },
  chipText: {
    ...Typography.Body,
    fontSize: 14,
    color: Colors.Starlight,
    opacity: 0.8,
  },
  chipTextSelected: {
    opacity: 1,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.DeepNight,
    borderRadius: Layout.radius,
    padding: Spacing.m,
    color: Colors.Starlight,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.ShadowPurple,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.m,
    backgroundColor: Colors.VoidBlack,
    borderTopWidth: 1,
    borderTopColor: Colors.ShadowPurple,
  },
  submitButton: {
    backgroundColor: Colors.StarBlue,
    paddingVertical: Spacing.m,
    borderRadius: Layout.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    ...Typography.Body,
    fontWeight: 'bold',
    color: Colors.Starlight,
    fontSize: 16,
  },
});
