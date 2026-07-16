import { colors, palette, spacing, typography } from '@/shared/theme';

describe('theme tokens', () => {
  it('exposes light and dark palettes with required keys', () => {
    for (const scheme of ['light', 'dark'] as const) {
      expect(colors[scheme].tint).toBeTruthy();
      expect(colors[scheme].background).toBeTruthy();
      expect(colors[scheme].text).toBeTruthy();
    }
  });

  it('uses a sage accent rather than a generic purple', () => {
    expect(palette.sage.toLowerCase()).toBe('#2f5d50');
    expect(colors.light.tint).toBe(palette.sage);
  });

  it('defines spacing and typography scales', () => {
    expect(spacing.md).toBe(16);
    expect(typography.body.fontSize).toBe(16);
  });
});
