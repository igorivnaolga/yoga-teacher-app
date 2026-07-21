import * as Clipboard from 'expo-clipboard';
import { useCallback, useState } from 'react';
import { Share } from 'react-native';

import { backupService } from '@/data';
import { serializeBackup, type AppBackup } from '@/domain/backup';

export function useBackup() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<AppBackup | null>(null);

  const clearStatus = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const copyBackup = useCallback(async () => {
    setBusy(true);
    clearStatus();
    try {
      const backup = await backupService.exportBackup();
      await Clipboard.setStringAsync(serializeBackup(backup));
      setLastBackup(backup);
      setMessage(
        `Copied backup (${backup.classPlans.length} plans, ${backup.customPoses.length} custom poses).`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not export backup.');
    } finally {
      setBusy(false);
    }
  }, [clearStatus]);

  const shareBackup = useCallback(async () => {
    setBusy(true);
    clearStatus();
    try {
      const backup = await backupService.exportBackup();
      await Share.share({
        message: serializeBackup(backup),
        title: 'Yoga Teacher backup',
      });
      setLastBackup(backup);
      setMessage('Share sheet opened with your backup JSON.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not share backup.');
    } finally {
      setBusy(false);
    }
  }, [clearStatus]);

  const restoreFromClipboard = useCallback(async () => {
    setBusy(true);
    clearStatus();
    try {
      const raw = await Clipboard.getStringAsync();
      const parsed = backupService.parseBackupJson(raw);
      if (!parsed.ok) {
        setError(parsed.error.message);
        return false;
      }
      await backupService.restoreBackup(parsed.backup);
      setLastBackup(parsed.backup);
      setMessage(
        `Restored ${parsed.backup.classPlans.length} plans, ${parsed.backup.courses.length} courses, ${parsed.backup.taughtSessions.length} taught sessions.`,
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not restore backup.');
      return false;
    } finally {
      setBusy(false);
    }
  }, [clearStatus]);

  return {
    busy,
    message,
    error,
    lastBackup,
    copyBackup,
    shareBackup,
    restoreFromClipboard,
    clearStatus,
  };
}
