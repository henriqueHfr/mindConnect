import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';
import { ptBR } from '../src/i18n/pt-BR';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('pt-BR');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.row}>
        <Text style={styles.label}>{ptBR.settings.notificacoes}</Text>
        <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: Colors.light.primary }} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{ptBR.settings.tema}</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: Colors.light.primary }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ptBR.settings.idioma}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity style={[styles.langOption, language === 'pt-BR' && styles.langSelected]} onPress={() => setLanguage('pt-BR')}>
            <Text style={[styles.langText, language === 'pt-BR' && styles.langTextSelected]}>Português (BR)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.langOption, language === 'en' && styles.langSelected]} onPress={() => setLanguage('en')}>
            <Text style={[styles.langText, language === 'en' && styles.langTextSelected]}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton style={{ width: 200 }} onPress={() => {}}>{ptBR.settings.editar}</PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  label: {
    color: Colors.light.text,
    fontSize: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    color: Colors.light.icon,
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.white,
  },
  langSelected: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  langText: {
    color: Colors.light.text,
  },
  langTextSelected: {
    color: Colors.light.primary,
    fontWeight: '700',
  },
});
