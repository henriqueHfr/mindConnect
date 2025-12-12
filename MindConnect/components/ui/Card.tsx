import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors } from '../../constants/Colors';

type Props = ViewProps & { children?: React.ReactNode };

export function Card({ children, style, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
});
