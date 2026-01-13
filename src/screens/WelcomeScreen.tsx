import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Layout } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setProfile } = useAuthStore();

  const handleSelectProfile = (profile: 'Illy' | 'Mins') => {
    setProfile(profile);
    navigation.navigate('Pairing');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.VoidBlack, Colors.DeepNight]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Darlen-ls</Text>
        <Text style={styles.subtitle}>Select your profile</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectProfile('Illy')}
          >
            <Text style={styles.buttonText}>Illy</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing.l }} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectProfile('Mins')}
          >
            <Text style={styles.buttonText}>Mins</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...Typography.Headings,
    fontSize: 48,
    color: Colors.Starlight,
    marginBottom: Spacing.s,
    fontStyle: 'italic', // Approximate 'cinematic' feel
  },
  subtitle: {
    ...Typography.Body,
    fontSize: 18,
    color: Colors.Starlight,
    opacity: 0.7,
    marginBottom: Spacing.xxl * 2,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: Colors.ShadowPurple,
    paddingVertical: Spacing.l,
    borderRadius: Layout.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.StarBlue,
    shadowColor: Colors.StarBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    ...Typography.Body,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.Starlight,
  },
});
