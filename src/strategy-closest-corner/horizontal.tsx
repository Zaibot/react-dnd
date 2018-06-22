import { IBounds, IPosition } from "../utils";
import { pDistance, IClosestCornerElement, IClosestCornerResult } from "./utils";

const calcDistanceLeft = (position: IPosition, bounds: IBounds) => pDistance(
    position.left,
    position.top,
    bounds.left,
    bounds.top,
    bounds.left,
    bounds.bottom);
const calcDistanceRight = (position: IPosition, bounds: IBounds) => pDistance(
    position.left,
    position.top,
    bounds.right - 1,
    bounds.top,
    bounds.right - 1,
    bounds.bottom);

export const horizontal = (target: IPosition, elements: IClosestCornerElement[]): IClosestCornerResult | null => {
    const foundTop = elements.reduce<IClosestCornerResult | null>((state, element) => {
        const distance = calcDistanceLeft(target, element.bounds);
        const isCloserOrNull = !state || distance < state.distance;
        return isCloserOrNull ? { element, distance, isBefore: true, isAfter: false } : state;
    }, null);
    const foundEither = elements.reduce((state, element) => {
        const distance = calcDistanceRight(target, element.bounds);
        const isCloserOrNull = !state || distance < state.distance;
        return isCloserOrNull ? { element, distance, isBefore: false, isAfter: true } : state;
    }, foundTop);
    return foundEither || null;
};
