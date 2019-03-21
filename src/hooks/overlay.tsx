import { useMemo } from "react";
import { Interaction } from "./interaction";

export interface RelPos {
    readonly relX: number;
    readonly clientX: number;
    readonly relY: number;
    readonly clientY: number;
}

export const calcLayerOffsetToClient = (origin?: Interaction, current?: Interaction): RelPos | null => {
    if (!origin || !current) {
        return null;
    }
    const relX = origin.controlX - origin.clientX;
    const clientX = (current || origin).clientX + relX;
    const relY = origin.controlY - origin.clientY;
    const clientY = (current || origin).clientY + relY;
    return { relX, clientX, relY, clientY };
};
