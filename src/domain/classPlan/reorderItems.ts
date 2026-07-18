import type { ClassPlanItem } from './types';

function renumber(items: ClassPlanItem[]): ClassPlanItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }));
}

export function sortItemsByOrder(items: readonly ClassPlanItem[]): ClassPlanItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function reorderItems(
  items: readonly ClassPlanItem[],
  fromIndex: number,
  toIndex: number,
): ClassPlanItem[] {
  const sorted = sortItemsByOrder(items);

  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= sorted.length ||
    toIndex >= sorted.length ||
    fromIndex === toIndex
  ) {
    return sorted;
  }

  const next = [...sorted];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return sorted;
  }
  next.splice(toIndex, 0, moved);
  return renumber(next);
}

export function moveItemUp(items: readonly ClassPlanItem[], index: number): ClassPlanItem[] {
  return reorderItems(items, index, index - 1);
}

export function moveItemDown(items: readonly ClassPlanItem[], index: number): ClassPlanItem[] {
  return reorderItems(items, index, index + 1);
}

export function removeItemAt(items: readonly ClassPlanItem[], index: number): ClassPlanItem[] {
  const sorted = sortItemsByOrder(items);
  if (index < 0 || index >= sorted.length) {
    return sorted;
  }
  return renumber(sorted.filter((_, i) => i !== index));
}

export function appendItem(
  items: readonly ClassPlanItem[],
  item: Omit<ClassPlanItem, 'order'>,
): ClassPlanItem[] {
  const sorted = sortItemsByOrder(items);
  return renumber([...sorted, { ...item, order: sorted.length }]);
}
