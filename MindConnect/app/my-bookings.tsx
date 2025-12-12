import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useAuth } from '../src/auth/AuthContext';

export default function MyBookingsScreen() {
  const auth = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await auth.fetchWithAuth('/api/bookings', undefined);
      setBookings(res || []);
    } catch (e) {
      // handled by fetchWithAuth
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas sessões</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.therapist?.name ?? 'Terapeuta'}</Text>
                <Text style={styles.note}>{new Date(item.scheduledAt).toLocaleString()}</Text>
              </View>
              <View>
                <Text style={[styles.status, item.status === 'confirmed' ? { color: Colors.light.primary } : { color: Colors.light.icon }]}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      )}

      {!loading && bookings.length === 0 && <Text style={styles.empty}>Nenhuma sessão encontrada</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  list: { paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.white, padding: 12, borderRadius: 12, marginBottom: 12 },
  name: { fontWeight: '700', color: Colors.light.text },
  note: { color: Colors.light.icon, fontSize: 12 },
  status: { fontWeight: '700' },
  empty: { textAlign: 'center', color: Colors.light.icon, marginTop: 32 },
});
