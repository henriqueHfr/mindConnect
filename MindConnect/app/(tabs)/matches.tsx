import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../src/auth/AuthContext';
import { ptBR } from '../../src/i18n/pt-BR';

export default function MatchesScreen() {
  const auth = useAuth();
  const router = useRouter();
  const push = (router.push as unknown) as (path: string) => void;

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setLoading(true);
    try {
      const res = await auth.fetchWithAuth('/api/matches', undefined);
      // res is array of matches with user and therapist objects
      setMatches(res || []);
    } catch (e) {
      // handled by fetchWithAuth
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ptBR.matches.titulo}</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.therapist?.name ?? 'Terapeuta'}</Text>
                <Text style={styles.note}>{item.therapist?.note ?? item.therapist?.profession ?? ''}</Text>
              </View>

              <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={() => push(`/(tabs)/chat?matchId=${item.id}`)}>
                <Text style={styles.buttonText}>{ptBR.matches.conversar}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {matches.length === 0 && !loading && <Text style={styles.empty}>{ptBR.matches.semMatches}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.light.text, marginBottom: 12 },
  list: { paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.white, padding: 12, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 2 },
  info: { flex: 1 },
  name: { fontWeight: '700', color: Colors.light.text },
  note: { color: Colors.light.icon, fontSize: 12 },
  button: { backgroundColor: Colors.light.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: Colors.light.white, fontWeight: '700' },
  empty: { textAlign: 'center', color: Colors.light.icon, marginTop: 32 },
});
