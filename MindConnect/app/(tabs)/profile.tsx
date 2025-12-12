import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

const MOCK_PROFILES: Record<string, any> = {
  '1': { name: 'Dra. Mariana Silva', profession: 'Psicóloga Clínica · CRP 06/12345', about: 'Especialista em terapia cognitivo-comportamental com 8 anos de experiência atendendo adultos e adolescentes.' },
  '2': { name: 'Dr. João Pereira', profession: 'Psicólogo · CRP 07/54321', about: 'Atuação com crianças e adolescentes, foco em desenvolvimento infantil.' },
  '3': { name: 'Dra. Ana Costa', profession: 'Psicóloga de Família', about: 'Atendimento a casais e famílias com foco em comunicação e vínculo.' },
};

export default function ProfileScreen() {
  // Use a runtime require to access hook and avoid TypeScript export mismatch in this environment
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Router = require('expo-router');
  const params = (Router.useSearchParams ? Router.useSearchParams() : {}) as any;

  const id = String(params.id ?? '1');
  const profile = MOCK_PROFILES[id] ?? MOCK_PROFILES['1'];

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ opacity: fade, width: '100%', alignItems: 'center' }}>
        <Image source={require('../../assets/images/react-logo.png')} style={styles.avatar} />

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.profession}>{profile.profession}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8 anos</Text>
            <Text style={styles.statLabel}>{ptBR.profile.experiencia}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>PUC-SP</Text>
            <Text style={styles.statLabel}>{ptBR.profile.formacao}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>R$ 200</Text>
            <Text style={styles.statLabel}>{ptBR.profile.preco}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ptBR.profile.descricao}</Text>
          <Text style={styles.sectionText}>{profile.about}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionSecondary]} activeOpacity={0.85}>
            <MaterialIcons name="calendar-today" size={18} color={Colors.light.primary} />
            <Text style={[styles.actionTextSecondary]}> Ver horários</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonPrimary]} activeOpacity={0.9}>
            <MaterialIcons name="event-available" size={18} color="#fff" />
            <Text style={[styles.buttonPrimaryText]}>  {ptBR.profile.agendar}</Text>
          </TouchableOpacity>
        </View>
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
  avatar: {
    width: 260,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.light.text,
  },
  profession: {
    color: Colors.light.icon,
    marginBottom: 16,
  },
  section: {
    width: '100%',
    backgroundColor: Colors.light.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.light.text,
  },
  sectionText: {
    color: Colors.light.text,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontWeight: '800', color: Colors.light.text, fontSize: 16 },
  statLabel: { color: Colors.light.icon, fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 },
  actionSecondary: { flex: 1, backgroundColor: Colors.light.white, paddingVertical: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: '#EFEFEF' },
  actionTextSecondary: { color: Colors.light.text, fontWeight: '700' },
  buttonPrimary: { backgroundColor: Colors.light.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16 },
  buttonPrimaryText: { color: '#fff', fontWeight: '800' },
});
