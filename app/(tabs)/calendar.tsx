import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function CalendarScreen() {
  return (
    <Screen>
      <EmptyState
        title="Teaching calendar"
        message="Log classes you have taught and review your history by day. Coming soon."
      />
    </Screen>
  );
}
