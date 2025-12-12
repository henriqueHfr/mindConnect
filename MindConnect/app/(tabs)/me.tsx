import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

// use AuthContext to load profile and logout
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/auth/AuthContext';

export default function MeScreen() {
  const auth = useAuth();
  const router = useRouter();
  const push = (router.push as unknown) as (path: string) => void;

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await auth.fetchWithAuth('/api/users/me', undefined);
        if (mounted) setProfile(res);
      } catch (e) {
        // handled by fetchWithAuth
      } finally {
        setLoading(false);
        Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }).start();
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function onLogout() {
    await auth.logout();
    push('/login');
  }

  const avatarSource = profile?.avatarUrl
    ? { uri: ((global as any)?.API_BASE_URL ?? 'http://localhost:8080') + profile.avatarUrl }
    : require('../../assets/images/react-logo.png');

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ opacity: fade, alignItems: 'center', width: '100%' }}>
        <View style={styles.headerRow}>
          <Avatar source={avatarSource} size={96} style={styles.avatar} />
          <TouchableOpacity style={styles.editIcon} onPress={() => push('/edit-profile')}>
            <MaterialIcons name="edit" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{profile?.name ?? 'Usuário'}</Text>
        <Text style={styles.email}>{profile?.email ?? ''}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ptBR.userProfile.sobre}</Text>
          <Text style={styles.sectionText}>{profile?.bio ?? 'Sem descrição.'}</Text>
        </View>

        <View style={styles.settingsRow}>
          <PrimaryButton style={{ flex: 1 }} onPress={() => push('/(tabs)/matches')}>Ver meus Matches</PrimaryButton>
        </View>

        <View style={styles.settingsRow}>
          <PrimaryButton style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.light.primary }} onPress={() => push('/my-bookings')}>
            Minhas sessões
          </PrimaryButton>
        </View>

        <View style={{ height: 8 }} />

        <PrimaryButton style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.light.primary }} onPress={onLogout}>
          Sair
        </PrimaryButton>

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  headerRow: { width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatar: { marginBottom: 12 },
  editIcon: { position: 'absolute', right: 24, top: 18, backgroundColor: Colors.light.white, padding: 8, borderRadius: 20, elevation: 2 },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  email: {
    color: Colors.light.icon,
    marginBottom: 12,
  },
  section: {
    width: '100%',
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionText: {
    color: Colors.light.text,
    lineHeight: 20,
  },
  settingsRow: {
    width: '100%',
    marginTop: 8,
  },
});
