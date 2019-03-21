export interface IBounds {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export const emptyBounds: IBounds = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};

export const isBoundsSame = (l: IBounds | null, r: IBounds | null) =>
  l === r ||
  (l &&
    r &&
    l.left === r.left &&
    l.top === r.top &&
    l.right === r.right &&
    l.bottom === r.bottom);
