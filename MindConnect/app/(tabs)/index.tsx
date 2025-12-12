import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

export default function HomeScreen() {
  const router = useRouter();
  const push = (router.push as unknown) as (path: string) => void;

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [fade]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade }}>
        <Text style={styles.greeting}>Olá, Carlos 👋</Text>
        <Text style={styles.subtitle}>Bem-vindo ao {ptBR.appName}</Text>

        <View style={styles.actions}>
          <PrimaryButton style={styles.actionButton} onPress={() => push('/(tabs)/swipe')}>
            <View style={styles.actionContent}>
              <MaterialIcons name="explore" size={18} color="#fff" />
              <Text style={styles.actionText}>  Descobrir</Text>
            </View>
          </PrimaryButton>

          <PrimaryButton style={styles.actionButton} onPress={() => push('/(tabs)/explore')}>
            <View style={styles.actionContent}>
              <MaterialIcons name="search" size={18} color="#fff" />
              <Text style={styles.actionText}>  Buscar</Text>
            </View>
          </PrimaryButton>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => push('/(tabs)/matches')}>
            <MaterialIcons name="favorite" size={28} color={Colors.light.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Matches</Text>
              <Text style={styles.cardSubtitle}>Veja quem curtiu você</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => push('/(tabs)/chat')}>
            <MaterialIcons name="chat-bubble" size={28} color={Colors.light.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Chat</Text>
              <Text style={styles.cardSubtitle}>Converse com profissionais</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={{ flex: 1 }} />

      <Text style={styles.footer}>Cuide da sua saúde mental — pequenos passos importam.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 12,
  },
  subtitle: {
    color: Colors.light.icon,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    marginVertical: 8,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 18,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: '700',
    color: Colors.light.text,
  },
  cardSubtitle: {
    color: Colors.light.icon,
    marginTop: 4,
    fontSize: 12,
  },
  footer: {
    textAlign: 'center',
    color: Colors.light.icon,
    marginBottom: 12,
  },
});
