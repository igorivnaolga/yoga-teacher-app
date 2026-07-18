import { createTaughtSession } from './createTaughtSession';
import { validateTaughtSession } from './validateTaughtSession';

describe('validateTaughtSession', () => {
  it('accepts a valid draft', () => {
    expect(
      validateTaughtSession({
        classPlanId: 'plan-1',
        date: '2026-07-18',
        notes: 'Tuesday beginners',
      }),
    ).toEqual([]);
  });

  it('rejects missing plan and invalid date', () => {
    const errors = validateTaughtSession({
      classPlanId: '  ',
      date: 'not-a-date',
    });
    expect(errors.map((error) => error.field)).toEqual(['classPlanId', 'date']);
  });
});

describe('createTaughtSession', () => {
  it('creates a normalized session', () => {
    const session = createTaughtSession({
      id: 's1',
      classPlanId: ' plan-1 ',
      date: '2026-07-18',
      notes: '  Studio A  ',
      now: '2026-07-18T12:00:00.000Z',
    });

    expect(session).toEqual({
      id: 's1',
      classPlanId: 'plan-1',
      date: '2026-07-18',
      notes: 'Studio A',
      createdAt: '2026-07-18T12:00:00.000Z',
    });
  });
});
