import { Interaction } from "./interaction";
import React, { useContext, useEffect, useRef } from "react";
import warning from "warning";
import { DragSession } from "./DragSession";

export type AcceptDragSessionHandler = (origin: Interaction) => DragSession;
export type DeclineDragSessionHandler = (origin: Interaction) => DragSession;
export type CanDragSessionHandler = (session: DragSession) => boolean;

export interface DragInfo {
  readonly data: any;
  readonly origin: Interaction;
  readonly current?: Interaction;
}

export interface DropInfo {
  readonly data: any;
  readonly meta: any;
  readonly origin: Interaction;
  readonly current?: Interaction;
}

export interface DroppedInfo {
  readonly data: any;
  readonly meta: any;
  readonly origin: Interaction;
  readonly current?: Interaction;
}

//
// Central
export interface DndContextInfo {
  readonly session?: DragSession;
  readonly begin: (data: any, origin: Interaction) => DragSession;
}
const emptyContext: DndContextInfo = {
  begin: () => {
    warning(false, `[@zaibot/dnd] missing context`);
    return null!;
  }
};
export const DnDContext = React.createContext<DndContextInfo>(emptyContext);
export const useDnD = () => useContext(DnDContext);

//
// Source
export interface DndContextItemInfo {
  readonly data: any;
  readonly session?: DragSession;
  readonly begin: (origin: Interaction) => DragSession;
}
const emptyContextItem: DndContextItemInfo = {
  data: null,
  begin: () => {
    warning(false, `[@zaibot/dnd] missing source context`);
    return null!;
  }
};
export const DnDItemContext = React.createContext<DndContextItemInfo>(
  emptyContextItem
);
export const useDnDSource = () => useContext(DnDItemContext);

//
// Target
export interface DndContextTargetInfo {
  readonly session?: DragSession;
  readonly meta: any;
  readonly dropping?: {
    readonly session: DragSession;
    readonly accept: (origin: Interaction) => DragSession;
    readonly decline: (origin: Interaction) => DragSession;
  };
}
const emptyContextTarget: DndContextTargetInfo = {
  meta: null
};
export const DnDTargetContext = React.createContext<DndContextTargetInfo>(
  emptyContextTarget
);
export const useDnDTarget = () => useContext(DnDTargetContext);
