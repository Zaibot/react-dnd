export interface IPosition {
    readonly left: number;
    readonly top: number;
}

export const emptyPosition: IPosition = {
    left: 0,
    top: 0,
}

export const isPositionSame = (l: IPosition | null, r: IPosition | null) => (
    l === r
    || (
        (l && r)
        && (l.left === r.left)
        && (l.top === r.top)));
