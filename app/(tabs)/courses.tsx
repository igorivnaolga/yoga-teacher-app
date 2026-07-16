import { EmptyState } from '@/shared/ui/EmptyState';
import { Screen } from '@/shared/ui/Screen';

export default function CoursesScreen() {
  return (
    <Screen>
      <EmptyState
        title="No courses yet"
        message="Build multi-session paths like Foundation by linking class plans together. Coming soon."
      />
    </Screen>
  );
}
