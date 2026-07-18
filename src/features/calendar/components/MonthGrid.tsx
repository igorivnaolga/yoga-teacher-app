import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CalendarDayCell } from '@/domain/taughtSession';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { colors, palette, spacing, typography } from '@/shared/theme';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type MonthGridProps = {
  cells: CalendarDayCell[];
  selectedDateKey: string;
  todayKey: string;
  markedDates: Set<string>;
  onSelectDate: (dateKey: string) => void;
};

export function MonthGrid({
  cells,
  selectedDateKey,
  todayKey,
  markedDates,
  onSelectDate,
}: MonthGridProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <View>
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={[styles.weekday, { color: theme.textMuted }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell) => {
          const selected = cell.dateKey === selectedDateKey;
          const isToday = cell.dateKey === todayKey;
          const hasSessions = markedDates.has(cell.dateKey);

          return (
            <Pressable
              key={cell.dateKey}
              accessibilityRole="button"
              accessibilityLabel={`${cell.dateKey}${hasSessions ? ', has classes' : ''}`}
              onPress={() => onSelectDate(cell.dateKey)}
              style={[
                styles.cell,
                selected && { backgroundColor: theme.tint },
                !selected && isToday && { borderColor: theme.tint, borderWidth: 1 },
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: selected
                      ? palette.white
                      : cell.inCurrentMonth
                        ? theme.text
                        : theme.textMuted,
                    opacity: cell.inCurrentMonth ? 1 : 0.45,
                  },
                ]}
              >
                {cell.dayOfMonth}
              </Text>
              {hasSessions ? (
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: selected ? palette.white : theme.tint },
                  ]}
                />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekday: {
    ...typography.caption,
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 2,
  },
  dayNumber: {
    ...typography.caption,
    fontWeight: '600',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
  },
});
