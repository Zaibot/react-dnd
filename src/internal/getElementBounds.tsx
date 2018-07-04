import { IBounds, emptyBounds } from "../utils";

const toBounds = ({ left, top, height, width, right, bottom }: ClientRect | DOMRect): IBounds =>
    ({ left, top, height, width, right, bottom });

export const getElementBounds =
    (element: HTMLElement | null): IBounds | null =>
        element ? toBounds(element.getBoundingClientRect()) : null;

export const getElementBoundsOrEmpty =
    (element: HTMLElement | null): IBounds =>
        element ? toBounds(element.getBoundingClientRect()) : emptyBounds;
