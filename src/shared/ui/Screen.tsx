import { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, spacing } from '@/shared/theme';

type ScreenProps = ViewProps & {
  children: ReactNode;
  padded?: boolean;
};

export function Screen({ children, padded = true, style, ...rest }: ScreenProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safe, { backgroundColor: theme.background }]}
    >
      <View
        style={[styles.content, padded && styles.padded, { backgroundColor: theme.background }, style]}
        {...rest}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
