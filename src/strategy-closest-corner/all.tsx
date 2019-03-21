import { IBounds, IPosition } from "../utils";
import { pDistance, bDistance } from "./utils";

export enum ClosestCornerLocation {
  TopLeft = 0x11,
  Top = 0x10,
  TopRight = 0x12,
  MiddleLeft = 0x21,
  Middle = 0x20,
  MiddleRight = 0x22,
  BottomLeft = 0x41,
  Bottom = 0x40,
  BottomRight = 0x42
}

export interface IClosestCornerAllResult {
  readonly distance: number;
  readonly location: ClosestCornerLocation;
}

export interface IClosestCornerOptions {
  readonly allTop?: boolean;
  readonly allLeft?: boolean;
  readonly allRight?: boolean;
  readonly allBottom?: boolean;
}

const defaultOptions: IClosestCornerOptions = {
  allTop: true,
  allLeft: true,
  allRight: true,
  allBottom: true
};

export const all = (
  { left: x, top: y }: IPosition,
  { left, top, right, bottom }: IBounds,
  cornerSize: number,
  options?: IClosestCornerOptions
): IClosestCornerAllResult => {
  options = { ...defaultOptions, ...options };
  // abc
  // def
  // ghi
  const canTop = options.allTop && y < bottom;
  const canBottom = options.allBottom && y > top;
  const canLeft = options.allLeft && x < right;
  const canRight = options.allRight && x > left;

  //                           horizonal                                                              vertical
  // top
  const a = canTop &&
    canLeft && {
      distance: bDistance(x, y, left, top, left + cornerSize, top + cornerSize),
      location: ClosestCornerLocation.TopLeft
    };
  const b = canTop && {
    distance: bDistance(
      x,
      y,
      left + cornerSize,
      top,
      right - cornerSize,
      top + cornerSize
    ),
    location: ClosestCornerLocation.Top
  };
  const c = canTop &&
    canRight && {
      distance: bDistance(
        x,
        y,
        right - cornerSize,
        top,
        right,
        top + cornerSize
      ),
      location: ClosestCornerLocation.TopRight
    };
  // middle
  const d = canLeft && {
    distance: bDistance(
      x,
      y,
      left,
      top + cornerSize,
      left + cornerSize,
      bottom - cornerSize
    ),
    location: ClosestCornerLocation.MiddleLeft
  };
  const e = {
    distance: bDistance(
      x,
      y,
      left + cornerSize,
      top + cornerSize,
      right - cornerSize,
      bottom - cornerSize
    ),
    location: ClosestCornerLocation.Middle
  };
  const f = canRight && {
    distance: bDistance(
      x,
      y,
      right + cornerSize,
      top + cornerSize,
      right,
      bottom - cornerSize
    ),
    location: ClosestCornerLocation.MiddleRight
  };
  // bottom
  const g = canBottom &&
    canLeft && {
      distance: bDistance(
        x,
        y,
        left,
        bottom - cornerSize,
        left + cornerSize,
        bottom
      ),
      location: ClosestCornerLocation.BottomLeft
    };
  const h = canBottom && {
    distance: pDistance(
      x,
      y,
      left + cornerSize,
      bottom - cornerSize,
      right - cornerSize,
      bottom
    ),
    location: ClosestCornerLocation.Bottom
  };
  const i = canBottom &&
    canRight && {
      distance: bDistance(
        x,
        y,
        right - cornerSize,
        bottom - cornerSize,
        right,
        bottom
      ),
      location: ClosestCornerLocation.BottomRight
    };

  const list: IClosestCornerAllResult[] = [a, b, c, d, e, f, g, h, i] as any;
  let result = 4;
  for (let i = 0; i < 9; i++) {
    if (list[i] && list[i].distance < list[result].distance) {
      result = i;
    }
  }
  return list[result];
};
