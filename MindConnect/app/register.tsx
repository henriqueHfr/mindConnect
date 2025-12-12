import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const push = (router.push as unknown) as (path: string) => void;
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha nome, email e senha');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      push('/(tabs)');
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.inner}>
        <ThemedText type="title">Cadastrar</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor={Colors.light.icon}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.light.icon}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={Colors.light.icon}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton onPress={onSubmit} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Cadastrar'}
        </PrimaryButton>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Já tem conta?</Text>
          <TouchableOpacity onPress={() => push('/login')}>
            <Text style={styles.link}> Entrar</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 48,
    backgroundColor: Colors.light.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    color: Colors.light.text,
  },
  button: {
    marginTop: 18,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'center',
  },
  footerText: {
    color: Colors.light.icon,
  },
  link: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});
