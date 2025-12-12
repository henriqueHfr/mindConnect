import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

// Use AuthContext to call API
import { useAuth } from '../../src/auth/AuthContext';

export default function ExploreScreen() {
  const router = useRouter();
  const push = (router.push as unknown) as (path: string) => void;
  const auth = useAuth();

  const [therapists, setTherapists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 360, useNativeDriver: true }).start();
  }, [fade]);

  async function loadTherapists() {
    setLoading(true);
    try {
      const res = await auth.fetchWithAuth('/api/users/therapists', undefined);
      setTherapists(res || []);
    } catch (e) {
      // handled by fetchWithAuth
    } finally {
      setLoading(false);
    }
  }

  async function onMatch(therapistId: string) {
    setActing(therapistId);
    try {
      await auth.fetchWithAuth('/api/matches', { method: 'POST', body: JSON.stringify({ therapistId }) });
      // feedback: simple reload
      await loadTherapists();
    } catch (e) {
      // ignore
    } finally {
      setActing(null);
    }
  }

  function renderItem({ item }: { item: any }) {
    return (
      <Animated.View style={{ opacity: fade }}>
        <View style={styles.card}>
          <View style={styles.info}>
            <View style={styles.rowTop}>
              <View style={styles.avatarPlaceholder} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.spec}>{item.speciality ?? item.role ?? 'Psicólogo'}</Text>
              </View>
            </View>

            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.smallButton} onPress={() => push(`/(tabs)/profile?id=${item.id}`)}>
                <MaterialIcons name="visibility" size={16} color={Colors.light.text} />
                <Text style={styles.smallButtonText}>  Ver</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.book} onPress={() => push(`/booking?therapistId=${item.id}`)}>
                <Text style={styles.bookText}>Agendar</Text>
              </TouchableOpacity>

              <PrimaryButton style={{ paddingHorizontal: 10, marginLeft: 8 }} onPress={() => onMatch(item.id)}>
                {acting === item.id ? '...' : 'Curtir'}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ptBR.tabs.buscar}</Text>

      <TextInput placeholder="Pesquisar por nome, especialidade..." placeholderTextColor={Colors.light.icon} style={styles.search} value={search} onChangeText={setSearch} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={therapists.filter(t => (t.name ?? '').toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.light.text, marginBottom: 12 },
  search: { height: 44, borderRadius: 10, backgroundColor: Colors.light.white, paddingHorizontal: 12, color: Colors.light.text, marginBottom: 12 },
  list: { paddingBottom: 24 },
  card: { backgroundColor: Colors.light.white, borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  info: { flex: 1 },
  rowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarPlaceholder: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F4F6F8' },
  name: { fontWeight: '700', color: Colors.light.text, fontSize: 16 },
  spec: { color: Colors.light.icon, fontSize: 12 },
  rowActions: { flexDirection: 'row', alignItems: 'center' },
  book: { backgroundColor: Colors.light.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  bookText: { color: Colors.light.white, fontWeight: '700' },
  smallButton: { backgroundColor: '#F2F2F2', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  smallButtonText: { color: Colors.light.text },
});
