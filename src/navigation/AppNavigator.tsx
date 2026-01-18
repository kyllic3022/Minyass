import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import PairingScreen from '../screens/PairingScreen';
import HomeScreen from '../screens/HomeScreen';
import BPDCheckInScreen from '../screens/BPDCheckInScreen';
import PhotoLocketScreen from '../screens/PhotoLocketScreen';
import SharedNoteScreen from '../screens/SharedNoteScreen';
import MedicationScreen from '../screens/MedicationScreen';
import { Colors } from '../theme';

export type RootStackParamList = {
  Welcome: undefined;
  Pairing: undefined;
  Home: undefined;
  BPDCheckIn: undefined;
  PhotoLocket: undefined;
  SharedNote: undefined;
  Medication: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.VoidBlack,
        },
        headerTintColor: Colors.Starlight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Colors.VoidBlack,
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Pairing" component={PairingScreen} options={{ title: 'Pair Device' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BPDCheckIn" component={BPDCheckInScreen} options={{ title: 'BPD Check-In' }} />
      <Stack.Screen name="PhotoLocket" component={PhotoLocketScreen} options={{ title: 'Photo Locket' }} />
      <Stack.Screen name="SharedNote" component={SharedNoteScreen} options={{ title: 'Shared Note' }} />
      <Stack.Screen name="Medication" component={MedicationScreen} options={{ title: 'Medication' }} />
    </Stack.Navigator>
  );
}
