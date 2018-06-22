import { IBounds, DataKey } from "../utils";

export const pDistance = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
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
