import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function PlansScreen() {
  return (
    <Screen>
      <EmptyState
        title="No class plans yet"
        message="Create and organize the sequences you teach. Class plan builder arrives in the next steps."
      />
    </Screen>
  );
}
