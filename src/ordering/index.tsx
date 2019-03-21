import { Bounds } from "../hooks/measure";
import { closestCorner } from "../strategy-closest-corner";
import { IPosition } from "../utils";

const identity = <T extends any>(input: T) => input;

export function handleSortByBoundary<T extends {}>(
  items: T[],
  bounds: { [key: string]: Bounds },
  droppingKey: string,
  position: IPosition,
  selectKey: (item: T) => string
): T[];
export function handleSortByBoundary<T extends {}>(
  items: T[],
  bounds: { [key: string]: Bounds },
  droppingKey: string,
  position: IPosition,
  selectKey: (item: T) => any = identity
): T[] {
  const others = Object.entries(bounds)
    .filter(([key]) => key !== droppingKey)
    .map(([key, bounds]) => ({ key, bounds }));
  const closest = closestCorner.vertical(position, others);
  if (closest) {
    // Find dropping item
    const idxSrc = items.findIndex(x => selectKey(x) === droppingKey);
    const item = items[idxSrc];
    // Remove it from the list
    const updated = items.slice(0);
    updated.splice(idxSrc, 1);
    // Insert it at the new location
    const idxTarget = updated.findIndex(
      x => selectKey(x) === closest.element.key
    );
    updated.splice(idxTarget + (closest.isAfter ? 1 : 0), 0, item);
    return updated;
  }
  return items;
}
