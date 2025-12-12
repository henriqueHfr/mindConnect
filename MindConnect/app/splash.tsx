import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { ptBR } from '../src/i18n/pt-BR';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image source={require('../assets/images/partial-react-logo.png')} style={styles.logo} />
        <Text style={styles.title}>{ptBR.appName}</Text>
        <Text style={styles.subtitle}>{ptBR.onboarding.title3}</Text>
      </View>

      <TouchableOpacity style={styles.cta} activeOpacity={0.85}>
        <Text style={styles.ctaText}>{ptBR.onboarding.cta}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 36,
  },
  center: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    color: Colors.light.icon,
    marginTop: 8,
  },
  cta: {
    width: '90%',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: Colors.light.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
