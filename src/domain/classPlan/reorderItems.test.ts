import { appendItem, moveItemDown, moveItemUp, removeItemAt, reorderItems } from './reorderItems';
import type { ClassPlanItem } from './types';

const items: ClassPlanItem[] = [
  { id: 'a', poseId: 'mountain', order: 0 },
  { id: 'b', poseId: 'tree', order: 1 },
  { id: 'c', poseId: 'child', order: 2 },
];

describe('reorderItems', () => {
  it('moves an item to a new index and renumbers', () => {
    const next = reorderItems(items, 0, 2);
    expect(next.map((item) => item.id)).toEqual(['b', 'c', 'a']);
    expect(next.map((item) => item.order)).toEqual([0, 1, 2]);
  });

  it('returns sorted copy when indexes are invalid', () => {
    expect(reorderItems(items, -1, 1)).toEqual(items);
    expect(reorderItems(items, 0, 9)).toEqual(items);
  });
});

describe('move helpers', () => {
  it('moves up and down', () => {
    expect(moveItemUp(items, 1).map((item) => item.id)).toEqual(['b', 'a', 'c']);
    expect(moveItemDown(items, 0).map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });

  it('removes and appends items', () => {
    expect(removeItemAt(items, 1).map((item) => item.id)).toEqual(['a', 'c']);
    expect(
      appendItem(items, { id: 'd', poseId: 'crow' }).map((item) => item.id),
    ).toEqual(['a', 'b', 'c', 'd']);
  });
});
