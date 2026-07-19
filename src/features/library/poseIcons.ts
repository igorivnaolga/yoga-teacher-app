import type { PoseCategory } from '@/domain/pose';

/** Short category marks (system text — no icon-font loading on web). */
export const CATEGORY_MARKS: Record<PoseCategory, string> = {
  standing: 'St',
  seated: 'Se',
  supine: 'Su',
  prone: 'Pr',
  balance: 'Ba',
  inversion: 'In',
  twist: 'Tw',
  forward_fold: 'Ff',
  backbend: 'Bb',
  hip_opener: 'Hi',
  arm_balance: 'Ab',
  restorative: 'Re',
};

export function getCategoryMark(category?: PoseCategory): string {
  if (category && category in CATEGORY_MARKS) {
    return CATEGORY_MARKS[category];
  }
  return '•';
}
