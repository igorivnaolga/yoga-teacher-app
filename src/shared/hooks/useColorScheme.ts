import { useColorScheme as useRNColorScheme } from 'react-native';

import type { ColorSchemeName } from '@/shared/theme';

export function useColorScheme(): ColorSchemeName {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
