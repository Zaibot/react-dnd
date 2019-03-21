import React from "react";

export interface Interaction {
  readonly controlX: number;
  readonly controlY: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
}

export const distanceInteraction = (l: Interaction, r: Interaction) => {
  const x = Math.abs(l.pageX - r.pageX);
  const y = Math.abs(l.pageY - r.pageY);
  return Math.sqrt(x * x + y * y);
};

export const isInteractionSame = (
  l: Interaction | null,
  r: Interaction | null
) =>
  l === r ||
  (l &&
    r &&
    l.controlX === r.controlX &&
    l.controlY === r.controlY &&
    l.clientX === r.clientX &&
    l.clientY === r.clientY &&
    l.pageX === r.pageX &&
    l.pageY === r.pageY);

export type GenericInteractionEvent =
  | PointerEvent
  | MouseEvent
  | React.PointerEvent
  | React.MouseEvent;

export const toInteraction = (
  el: Element | undefined | null,
  e: GenericInteractionEvent
): Interaction => {
  return {
    controlX: el ? el.getBoundingClientRect().left : 0,
    controlY: el ? el.getBoundingClientRect().top : 0,
    clientX: e.clientX,
    clientY: e.clientY,
    pageX: e.pageX,
    pageY: e.pageY
  };
};
