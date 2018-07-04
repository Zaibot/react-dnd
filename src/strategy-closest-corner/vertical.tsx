import { IBounds, IPosition } from "../utils";
import { pDistance } from "./utils";
import { IClosestCornerElement, IClosestCornerResult } from "./data";

const calcDistanceTop = (position: IPosition, bounds: IBounds) => pDistance(
    position.left,
    position.top,
    bounds.left,
    bounds.top,
    bounds.right,
    bounds.top);
const calcDistanceBottom = (position: IPosition, bounds: IBounds) => pDistance(
    position.left,
    position.top,
    bounds.left,
    bounds.bottom - 1,
    bounds.right,
    bounds.bottom - 1);

export const vertical = (target: IPosition, elements: IClosestCornerElement[]): IClosestCornerResult | null => {
    const foundTop = elements.reduce<IClosestCornerResult | null>((state, element) => {
        const distance = calcDistanceTop(target, element.bounds);
        const isCloserOrNull = !state || distance < state.distance;
        return isCloserOrNull ? { element, distance, isBefore: true, isAfter: false } : state;
    }, null);
    const foundEither = elements.reduce((state, element) => {
        const distance = calcDistanceBottom(target, element.bounds);
        const isCloserOrNull = !state || distance < state.distance;
        return isCloserOrNull ? { element, distance, isBefore: false, isAfter: true } : state;
    }, foundTop);
    return foundEither || null;
};
