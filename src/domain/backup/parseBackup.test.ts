import { createBackup, serializeBackup } from './createBackup';
import { parseBackup } from './parseBackup';

describe('parseBackup', () => {
  it('round-trips a serialized backup', () => {
    const backup = createBackup({
      classPlans: [],
      taughtSessions: [],
      courses: [],
      customPoses: [],
      exportedAt: '2026-07-21T00:00:00.000Z',
    });

    const result = parseBackup(serializeBackup(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.backup).toEqual(backup);
    }
  });

  it('rejects invalid payloads', () => {
    expect(parseBackup('').ok).toBe(false);
    expect(parseBackup('{').ok).toBe(false);
    expect(parseBackup('[]').ok).toBe(false);
    expect(parseBackup(JSON.stringify({ version: 99 })).ok).toBe(false);
  });
});
