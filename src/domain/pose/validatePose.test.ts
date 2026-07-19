import { emptyPoseDraft } from './createPose';
import { validatePoseDraft } from './validatePose';

describe('validatePoseDraft', () => {
  it('requires a name', () => {
    const errors = validatePoseDraft(emptyPoseDraft());
    expect(errors.some((error) => error.field === 'name')).toBe(true);
  });

  it('accepts a minimal valid draft', () => {
    expect(
      validatePoseDraft({
        ...emptyPoseDraft(),
        name: 'My Flow Pose',
      }),
    ).toEqual([]);
  });
});
