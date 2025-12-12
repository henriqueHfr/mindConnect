import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';
import { ptBR } from '../src/i18n/pt-BR';

// Lazy router hooks
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Router = require('expo-router');

// Auth
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useAuth } = require('../src/auth/AuthContext');

const SAMPLE_DATES = [
  { id: '1', date: '2025-12-10', label: 'Qua, 10 Dez', times: ['14:00', '15:00', '16:30'] },
  { id: '2', date: '2025-12-11', label: 'Qui, 11 Dez', times: ['10:00', '11:30', '18:00'] },
  { id: '3', date: '2025-12-12', label: 'Sex, 12 Dez', times: ['09:00', '13:00', '17:00'] },
];

export default function BookingScreen() {
  const params = (Router.useSearchParams ? Router.useSearchParams() : {}) as any;
  const router = Router.useRouter ? Router.useRouter() : null;
  const therapistId = params.therapistId ?? null;

  const auth = useAuth();
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // could load therapist details if needed
  }, [therapistId]);

  async function confirm() {
    if (!therapistId || !selected) {
      Alert.alert('Selecione uma data e horário');
      return;
    }
    setLoading(true);
    try {
      const iso = `${selected.date}T${selected.time}:00Z`;
      const res = await auth.fetchWithAuth('/api/bookings', { method: 'POST', body: JSON.stringify({ therapistId, scheduledAt: iso, price: 200.0 }) });
      if (res && res.id) {
        Alert.alert('Agendado', 'Sua sessão foi agendada');
        router?.push('/(tabs)');
      } else {
        Alert.alert('Erro', res?.error || 'Não foi possível agendar');
      }
    } catch (e) {
      // handled by fetchWithAuth
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ptBR.booking.titulo}</Text>
      <Text style={styles.subtitle}>{ptBR.booking.selecione}</Text>

      <FlatList
        data={SAMPLE_DATES}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.dateCard}>
            <Text style={styles.dateLabel}>{item.label}</Text>
            <View style={styles.timesRow}>
              {item.times.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timePill, selected?.date === item.date && selected?.time === t ? { backgroundColor: Colors.light.primary } : undefined]}
                  activeOpacity={0.8}
                  onPress={() => setSelected({ date: item.date, time: t })}>
                  <Text style={[styles.timeText, selected?.date === item.date && selected?.time === t ? { color: '#fff' } : undefined]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.priceInfo}>{ptBR.booking.precoInfo}: R$ 200</Text>
        <PrimaryButton style={styles.confirm} onPress={confirm}>
          {loading ? <ActivityIndicator color="#fff" /> : ptBR.booking.confirmar}
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.light.text, marginBottom: 6 },
  subtitle: { color: Colors.light.icon, marginBottom: 12 },
  list: { paddingBottom: 16 },
  dateCard: { backgroundColor: Colors.light.white, borderRadius: 12, padding: 12, marginBottom: 12 },
  dateLabel: { fontWeight: '700', color: Colors.light.text, marginBottom: 8 },
  timesRow: { flexDirection: 'row', gap: 8 },
  timePill: { backgroundColor: '#F4F4F4', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  timeText: { color: Colors.light.text, fontWeight: '600' },
  footer: { paddingVertical: 12 },
  priceInfo: { color: Colors.light.icon, marginBottom: 8 },
  confirm: { width: '100%' },
});
