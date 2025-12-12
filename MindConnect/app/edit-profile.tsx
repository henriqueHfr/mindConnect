import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        // not fatal, user can still input url
      }
    })();
  }, []);

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
      if (!result.canceled) {
        // expo-image-picker v14 returns {assets: [{uri}]}
        // handle both shapes
        // @ts-ignore
        const uri = result.assets ? result.assets[0].uri : result.uri;
        setAvatarUri(uri);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  async function onSave() {
    setSaving(true);
    try {
      await updateProfile(name, bio, avatarUri ?? undefined);
      Alert.alert('Perfil atualizado');
      router.replace('/(tabs)/me');
    } catch (e: any) {
      Alert.alert('Erro', e?.message || 'Não foi possível atualizar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.inner}>
        <ThemedText type="title">Editar Perfil</ThemedText>

        <TouchableOpacity style={styles.avatarPicker} onPress={pickImage} activeOpacity={0.8}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Text style={styles.pickText}>Selecionar avatar</Text>
          )}
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={Colors.light.icon} value={name} onChangeText={setName} />
        <TextInput style={[styles.input, styles.multiline]} placeholder="Sobre você" placeholderTextColor={Colors.light.icon} value={bio} onChangeText={setBio} multiline numberOfLines={4} />

        <PrimaryButton onPress={onSave} style={styles.button}>
          {saving ? <ActivityIndicator color="#fff" /> : 'Salvar'}
        </PrimaryButton>

      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  inner: { padding: 20, flex: 1 },
  avatarPicker: { width: 120, height: 120, borderRadius: 12, backgroundColor: Colors.light.white, alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 12, overflow: 'hidden' },
  pickText: { color: Colors.light.icon },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  input: { height: 48, backgroundColor: Colors.light.white, borderRadius: 10, paddingHorizontal: 12, marginTop: 12, color: Colors.light.text },
  multiline: { height: 110, paddingTop: 12, textAlignVertical: 'top' },
  button: { marginTop: 18 }
});
