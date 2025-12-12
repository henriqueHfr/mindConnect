import { Tabs } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');
const MENU_WIDTH = Math.min(300, Math.round(width * 0.75));

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open

  function openMenu() {
    setMenuOpen(true);
    Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }

  function closeMenu(callback?: () => void) {
    Animated.timing(anim, { toValue: 0, duration: 260, useNativeDriver: true }).start(() => {
      setMenuOpen(false);
      callback?.();
    });
  }

  // Slide translate and backdrop opacity
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-MENU_WIDTH, 0] });
  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] });

  // Helper to navigate from menu entries
  // Use lazy require to mirror project pattern
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Router = require('expo-router');
  const router = Router.useRouter ? Router.useRouter() : null;
  const push = (router?.push as unknown) as (path: string) => void;

  function onNavigate(path: string) {
    closeMenu(() => push?.(path));
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="swipe"
          options={{
            title: 'Descobrir',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="hand.thumbsup.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="magnifyingglass" color={color} />,
          }}
        />
        <Tabs.Screen
          name="matches"
          options={{
            title: 'Matches',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="heart.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="bubble.left.and.bubble.right.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }: { color?: string }) => <IconSymbol size={24} name="person.crop.circle" color={color} />,
          }}
        />
      </Tabs>

      {/* Hamburger button */}
      <TouchableOpacity style={styles.hamburger} activeOpacity={0.8} onPress={openMenu}>
        <View style={[styles.hamburgerLine, { backgroundColor: Colors.light.icon }]} />
        <View style={[styles.hamburgerLine, { backgroundColor: Colors.light.icon }]} />
        <View style={[styles.hamburgerLine, { backgroundColor: Colors.light.icon }]} />
      </TouchableOpacity>

      {/* Animated backdrop and side menu */}
      {menuOpen && (
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} pointerEvents={menuOpen ? 'auto' : 'none'}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
        </Animated.View>
      )}

      {menuOpen && (
        <Animated.View style={[styles.menu, { transform: [{ translateX }] }] }>
          <View style={styles.menuInner}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)')}>
              <Text style={styles.menuItemText}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)/swipe')}>
              <Text style={styles.menuItemText}>Descobrir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)/explore')}>
              <Text style={styles.menuItemText}>Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)/matches')}>
              <Text style={styles.menuItemText}>Matches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)/chat')}>
              <Text style={styles.menuItemText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/(tabs)/me')}>
              <Text style={styles.menuItemText}>Perfil</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/settings')}>
              <Text style={styles.menuItemText}>Configurações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('/login')}>
              <Text style={[styles.menuItemText, { color: Colors.light.primary }]}>Sair / Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    position: 'absolute',
    top: 44,
    left: 14,
    zIndex: 40,
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'transparent',
  },
  hamburgerLine: {
    height: 2,
    width: 22,
    borderRadius: 2,
    marginVertical: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 30,
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    zIndex: 40,
    backgroundColor: Colors.light.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  menuInner: {
    paddingTop: 80,
    paddingHorizontal: 18,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.light.text,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuItemText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 12,
  },
});
