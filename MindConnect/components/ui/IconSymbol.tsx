// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Map only the SF Symbols we use to their closest MaterialIcon equivalent.
// Use a plain record<string, string> so we don't have to list every SF Symbol name.
const MAPPING: Record<string, string> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'hand.thumbsup.fill': 'thumb_up',
  'magnifyingglass': 'search',
  'heart.fill': 'favorite',
  'bubble.left.and.bubble.right.fill': 'chat_bubble',
  'person.crop.circle': 'person',
};

type IconSymbolName = SymbolViewProps['name'];

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Look up a mapped Material icon name. If there's no mapping, fall back to a reasonable
  // default icon (here 'help') to avoid runtime errors on platforms that expect Material icons.
  const mappedName = (MAPPING as Record<string, string>)[name] ?? 'help';

  const iconColor = (color ?? '#000') as string | OpaqueColorValue;
  return <MaterialIcons color={iconColor} size={size} name={mappedName as ComponentProps<typeof MaterialIcons>['name']} style={style} />;
}
