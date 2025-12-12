import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

// Lazy router hooks to avoid typed-routes compile mismatch in this environment
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Router = require('expo-router');

export default function ChatScreen() {
  const params = (Router.useSearchParams ? Router.useSearchParams() : {}) as any;
  const router = Router.useRouter ? Router.useRouter() : null;
  const matchIdParam = params.matchId ?? null;

  // Auth helper
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAuth } = require('../../src/auth/AuthContext');
  const auth = useAuth();

  const [matches, setMatches] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');

  const sendAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (matchIdParam) {
      loadMessages(matchIdParam);
    } else {
      loadMatches();
    }
  }, [matchIdParam]);

  async function loadMatches() {
    setLoading(true);
    try {
      const res = await auth.fetchWithAuth('/api/matches');
      setMatches(res || []);
    } catch (e) {
      // already handled by fetchWithAuth logout on 401
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(matchId: string | number) {
    setLoading(true);
    try {
      const res = await auth.fetchWithAuth(`/api/matches/${matchId}/messages`);
      setMessages(res || []);
    } catch (e) {
      // handled upstream
    } finally {
      setLoading(false);
    }
  }

  async function onSend() {
    if (!text.trim() || !matchIdParam || sending) return;
    setSending(true);
    // pulse animation
    Animated.sequence([
      Animated.timing(sendAnim, { toValue: 0.9, duration: 90, useNativeDriver: true }),
      Animated.timing(sendAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      const res = await auth.fetchWithAuth(`/api/matches/${matchIdParam}/messages`, { method: 'POST', body: JSON.stringify({ text }) });
      setMessages((s) => [...s, res]);
      setText('');
      // scroll handled by FlatList automatically when dataset changes
    } catch (e) {
      // ignore
    } finally {
      setSending(false);
    }
  }

  function renderMessage(item: any) {
    const fromMe = item.sender?.id === auth.user?.id;
    return (
      <View style={[styles.messageRow, fromMe ? styles.rowMe : styles.rowThem]}>
        {!fromMe && <Avatar source={require('../../assets/images/react-logo.png')} size={40} style={styles.avatar} />}
        <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.messageText, fromMe ? styles.messageTextMe : styles.messageTextThem]}>{item.text}</Text>
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    );
  }

  if (!matchIdParam) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Conversas</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => router?.push(`/(tabs)/chat?matchId=${item.id}`)}>
                <Avatar source={require('../../assets/images/react-logo.png')} size={48} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.therapist?.name ?? 'Terapeuta'}</Text>
                  <Text style={styles.note}>{item.therapist?.profession ?? ''}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={Colors.light.icon} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router?.back()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={26} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversa</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => renderMessage(item)}
      />

      <View style={styles.inputRow}>
        <TextInput placeholder={ptBR.chat.escreva} placeholderTextColor={Colors.light.icon} style={styles.input} value={text} onChangeText={setText} editable={!sending} />
        <Animated.View style={{ transform: [{ scale: sendAnim }] }}>
          <TouchableOpacity onPress={onSend} disabled={!text.trim() || sending} style={[styles.sendButton, (!text.trim() || sending) ? { opacity: 0.6 } : undefined]}>
            {sending ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: { fontSize: 22, fontWeight: '700', color: Colors.light.text, margin: 16 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F2', backgroundColor: Colors.light.background },
  backButton: { width: 40, alignItems: 'flex-start' },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '700', color: Colors.light.text },
  list: { padding: 16, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  rowMe: { justifyContent: 'flex-end' },
  rowThem: { justifyContent: 'flex-start' },
  avatar: { marginRight: 8 },
  bubble: { maxWidth: '78%', padding: 12, borderRadius: 14 },
  bubbleMe: { backgroundColor: Colors.light.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: Colors.light.white, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  messageText: { fontSize: 14 },
  messageTextMe: { color: Colors.light.white, fontWeight: '600' },
  messageTextThem: { color: Colors.light.text },
  timeText: { marginTop: 6, fontSize: 10, color: Colors.light.icon, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: Colors.light.background },
  input: { flex: 1, height: 44, backgroundColor: Colors.light.white, borderRadius: 10, paddingHorizontal: 12, marginRight: 8, color: Colors.light.text },
  sendButton: { width: 44, height: 44, borderRadius: 10, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.white, padding: 12, borderRadius: 12, marginHorizontal: 16, marginBottom: 12 },
  name: { fontWeight: '700', color: Colors.light.text },
  note: { color: Colors.light.icon, fontSize: 12 },
});
