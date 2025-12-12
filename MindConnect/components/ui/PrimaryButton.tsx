import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
};

export function PrimaryButton({ children, onPress, style }: Props) {
  const scale = React.useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  }

  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  }

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress} style={({ pressed }) => [styles.wrapper, style, pressed ? { opacity: 0.95 } : undefined]}>
      <Animated.View style={[styles.button, { transform: [{ scale }] }] }>
        <Text style={styles.text}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 10,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: Colors.light.white,
    fontWeight: '700',
  },
});
