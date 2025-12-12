import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(320, Math.round(width * 0.85));

export function SideMenu({ visible, onClose, onNavigate }: { visible: boolean; onClose: () => void; onNavigate?: (path: string) => void }) {
  const offset = useSharedValue(visible ? 0 : -MENU_WIDTH);
  const backdropOpacity = useSharedValue(visible ? 0.4 : 0);

  useEffect(() => {
    offset.value = withTiming(visible ? 0 : -MENU_WIDTH, { duration: 300 });
    backdropOpacity.value = withTiming(visible ? 0.4 : 0, { duration: 300 });
  }, [visible, offset, backdropOpacity]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <View pointerEvents={visible ? 'auto' : 'none'} style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <Animated.View style={[styles.panel, panelStyle]}>
        <Text style={styles.title}>Menu</Text>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={() => {
            onNavigate?.('/(tabs)');
            onClose();
          }}>
          <Text style={styles.itemText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={() => {
            onNavigate?.('/(tabs)/explore');
            onClose();
          }}>
          <Text style={styles.itemText}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={() => {
            onNavigate?.('/(tabs)/me');
            onClose();
          }}>
          <Text style={styles.itemText}>Perfil</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.logout} activeOpacity={0.85} onPress={() => { onNavigate?.('/login'); onClose(); }}>
          <Text style={styles.logoutText}>Sair (mock)</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: Colors.light.white,
    paddingTop: 48,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.light.text,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    color: Colors.light.text,
    fontWeight: '600',
  },
  logout: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  logoutText: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
