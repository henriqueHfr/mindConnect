import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { ptBR } from '../src/i18n/pt-BR';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/partial-react-logo.png')} style={styles.logo} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{ptBR.onboarding.title1}</Text>
        <Text style={styles.subtitle}>{ptBR.onboarding.title2}</Text>
        <Text style={styles.subtitle}>{ptBR.onboarding.title3}</Text>
      </View>

      <TouchableOpacity style={styles.cta} activeOpacity={0.8}>
        <Text style={styles.ctaText}>{ptBR.onboarding.cta}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: Math.min(280, width - 40),
    height: 160,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    marginBottom: 6,
  },
  cta: {
    width: '90%',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  ctaText: {
    color: Colors.light.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
