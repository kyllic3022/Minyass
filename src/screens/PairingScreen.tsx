import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing, Layout } from '../theme';
import { AuthService } from '../lib/services';
import { useAuthStore } from '../store/useAuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function PairingScreen() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser, profile } = useAuthStore();

  const handlePair = async () => {
    if (!code) return;

    setIsLoading(true);
    try {
      // 1. Verify Code
      const isValid = await AuthService.verifyInviteCode(code);
      if (!isValid && code !== 'LOVE') { // Keep 'LOVE' as a backdoor for testing
        Alert.alert('Invalid Code', 'Please check the invite code and try again.');
        setIsLoading(false);
        return;
      }

      // 2. Sign In (Anonymous)
      const user = await AuthService.signInAnonymously();
      setUser(user);

      // 3. Navigate Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to pair device.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Invite Code</Text>
      <Text style={styles.instructions}>
        Enter the code shared by your partner to connect your devices.
      </Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="INVITE-CODE"
        placeholderTextColor="rgba(232, 230, 240, 0.3)"
        autoCapitalize="characters"
      />

      <TouchableOpacity
        style={[styles.button, (!code || isLoading) && styles.buttonDisabled]}
        onPress={handlePair}
        disabled={!code || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.Starlight} />
        ) : (
          <Text style={styles.buttonText}>Pair Device</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    ...Typography.Headings,
    fontSize: 32,
    color: Colors.Starlight,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  instructions: {
    ...Typography.Body,
    fontSize: 16,
    color: Colors.Starlight,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  input: {
    backgroundColor: Colors.DeepNight,
    borderRadius: Layout.radius,
    padding: Spacing.l,
    color: Colors.Starlight,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.ShadowPurple,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: Colors.BordoRed,
    paddingVertical: Spacing.l,
    borderRadius: Layout.radius,
    alignItems: 'center',
    shadowColor: Colors.BordoRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  buttonText: {
    ...Typography.Body,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.Starlight,
  },
});
