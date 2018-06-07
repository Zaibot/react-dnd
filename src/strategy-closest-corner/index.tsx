import { DataKey, IBounds, IPosition } from "../utils";

const pDistance = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1; //in case of 0 length line

    let xx = 0, yy = 0;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
};

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

export interface IClosestCornerElement {
    readonly key: DataKey;
    readonly bounds: IBounds;
}

export interface IClosestCornerResult {
    readonly isBefore: boolean;
    readonly isAfter: boolean;
    readonly element: IClosestCornerElement;
    readonly distance: number;
}

export const closestCorner = {
    vertical: (target: IPosition, elements: IClosestCornerElement[]): IClosestCornerResult | null => {
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
    },
    horizontal: (target: IPosition, elements: IClosestCornerElement[]): IClosestCornerResult | null => {
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
    },
};
