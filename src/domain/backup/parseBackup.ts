import { BACKUP_VERSION, type AppBackup, type BackupParseError } from './types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export type ParseBackupResult =
  | { ok: true; backup: AppBackup }
  | { ok: false; error: BackupParseError };

export function parseBackup(raw: string): ParseBackupResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: { message: 'Backup is empty.' } };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: { message: 'Backup is not valid JSON.' } };
  }

  if (!isObject(parsed)) {
    return { ok: false, error: { message: 'Backup must be a JSON object.' } };
  }

  if (parsed.version !== BACKUP_VERSION) {
    return {
      ok: false,
      error: { message: `Unsupported backup version (expected ${BACKUP_VERSION}).` },
    };
  }

  if (typeof parsed.exportedAt !== 'string' || !parsed.exportedAt) {
    return { ok: false, error: { message: 'Backup is missing exportedAt.' } };
  }

  for (const key of ['classPlans', 'taughtSessions', 'courses', 'customPoses'] as const) {
    if (!isArray(parsed[key])) {
      return { ok: false, error: { message: `Backup is missing ${key} array.` } };
    }
  }

  return {
    ok: true,
    backup: {
      version: BACKUP_VERSION,
      exportedAt: parsed.exportedAt,
      classPlans: parsed.classPlans as AppBackup['classPlans'],
      taughtSessions: parsed.taughtSessions as AppBackup['taughtSessions'],
      courses: parsed.courses as AppBackup['courses'],
      customPoses: parsed.customPoses as AppBackup['customPoses'],
    },
  };
}
