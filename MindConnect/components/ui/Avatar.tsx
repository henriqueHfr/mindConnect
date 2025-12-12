import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

type Props = {
  source: any;
  size?: number;
  style?: ImageStyle;
};

export function Avatar({ source, size = 64, style }: Props) {
  return <Image source={source} style={[styles(size).avatar, style]} />;
}

const styles = (size: number) =>
  StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: size / 6,
      resizeMode: 'cover',
    } as ImageStyle,
  });
