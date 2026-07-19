import { CATEGORY_MARKS, getCategoryMark } from './poseIcons';

describe('poseIcons', () => {
  it('maps every category to a short mark', () => {
    expect(Object.keys(CATEGORY_MARKS)).toHaveLength(12);
    expect(getCategoryMark('balance')).toBe('Ba');
    expect(getCategoryMark('restorative')).toBe('Re');
  });

  it('falls back when category is missing', () => {
    expect(getCategoryMark(undefined)).toBe('•');
  });
});
