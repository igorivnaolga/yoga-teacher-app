import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function LibraryScreen() {
  return (
    <Screen>
      <EmptyState
        title="Pose library"
        message="Browse poses with categories and tags to build varied sequences. Coming soon."
      />
    </Screen>
  );
}
