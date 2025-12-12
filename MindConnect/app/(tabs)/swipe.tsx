import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ptBR } from '../../src/i18n/pt-BR';

export default function SwipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ptBR.swipe.title}</Text>
      <Text style={styles.subtitle}>{ptBR.swipe.subtitle}</Text>

      <View style={styles.card}>
        <Image
          source={require('../../assets/images/react-logo.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.cardBody}>
          <Text style={styles.name}>Dra. Mariana Silva</Text>
          <Text style={styles.profession}>Psicóloga Clínica · CRP 06/12345</Text>
          <Text style={styles.description} numberOfLines={3}>
            Especialista em terapia cognitivo-comportamental com 8 anos de
            experiência atendendo adultos e adolescentes.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.nope]}>
          <Text style={styles.actionText}>{ptBR.swipe.nope}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.like]}>
          <Text style={styles.actionText}>{ptBR.swipe.like}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 12,
  },
  avatar: {
    width: '100%',
    height: 220,
  },
  cardBody: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  profession: {
    fontSize: 13,
    color: Colors.light.icon,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nope: {
    backgroundColor: '#EEEEEE',
  },
  like: {
    backgroundColor: Colors.light.primary,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
  },
});
