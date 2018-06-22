import { IBounds, IPosition } from "../utils";
import { pDistance } from "./utils";

export enum ClosestCornerLocation {
    TopLeft = 0x11,
    Top = 0x10,
    TopRight = 0x12,
    MiddleLeft = 0x21,
    Middle = 0x20,
    MiddleRight = 0x22,
    BottomLeft = 0x41,
    Bottom = 0x40,
    BottomRight = 0x42,
}

export interface IClosestCornerAllResult {
    readonly distance: number;
    readonly location: ClosestCornerLocation;
}

export const all = ({ left, top, right, bottom }: IBounds, { left: x, top: y }: IPosition, cornerSize: number): IClosestCornerAllResult => {
    // abc
    // def
    // ghi

    //                           horizonal                                                              vertical
    // top
    const a = { distance: Math.min(pDistance(x, y, left, top, left + cornerSize, top), pDistance(x, y, left, top, left, top + cornerSize)), location: ClosestCornerLocation.TopLeft };
    const b = { distance: pDistance(x, y, left + cornerSize, top, right - cornerSize, top), location: ClosestCornerLocation.Top };
    const c = { distance: Math.min(pDistance(x, y, right - cornerSize, top, right, top), pDistance(x, y, right, top, right, top + cornerSize)), location: ClosestCornerLocation.TopRight };
    // middle
    const d = { distance: pDistance(x, y, left, top + cornerSize, left, bottom - cornerSize), location: ClosestCornerLocation.MiddleLeft };
    const e = { distance: pDistance(x, y, left + cornerSize, top + cornerSize, right - cornerSize, bottom - cornerSize), location: ClosestCornerLocation.Middle };
    const f = { distance: pDistance(x, y, right, top + cornerSize, right, bottom - cornerSize), location: ClosestCornerLocation.MiddleRight };
    // bottom
    const g = { distance: Math.min(pDistance(x, y, left, bottom, left + cornerSize, bottom), pDistance(x, y, left, bottom, left, bottom + cornerSize)), location: ClosestCornerLocation.BottomLeft };
    const h = { distance: pDistance(x, y, left + cornerSize, bottom, right - cornerSize, bottom), location: ClosestCornerLocation.Bottom };
    const i = { distance: Math.min(pDistance(x, y, right - cornerSize, bottom, right, bottom), pDistance(x, y, right, bottom, right, bottom + cornerSize)), location: ClosestCornerLocation.BottomRight };

    return [b, c, d, e, f, g, h, i].reduce((s, n) => (n.distance < s.distance) ? n : s, a);
};
