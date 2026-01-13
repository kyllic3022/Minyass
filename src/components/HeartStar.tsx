import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { Colors } from '../theme';

interface HeartStarProps {
  onPress: () => void;
  isSending?: boolean;
}

export default function HeartStar({ onPress, isSending }: HeartStarProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Continuous breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      transform: [{ scale: scale.value * 1.5 }],
    };
  });

  const handlePress = () => {
    // Haptic feedback feedback usually happens in parent, here we just animate
    scale.value = withSequence(
      withSpring(0.8, { damping: 10 }),
      withSpring(1.1, { damping: 10 }),
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }) // Return to loop base?
    );
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.container}>
      {/* Glow Halo */}
      <Animated.View style={[styles.halo, glowStyle]} />

      {/* Core Heart */}
      <Animated.View style={[styles.core, animatedStyle]}>
        <Heart
          size={80}
          color={isSending ? Colors.EmberRed : Colors.BordoRed}
          fill={isSending ? Colors.EmberRed : Colors.BordoRed}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  halo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.BordoRed,
    opacity: 0.3,
    shadowColor: Colors.BordoRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 10,
  },
  core: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.EmberRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
});
