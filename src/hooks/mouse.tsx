import { useCallback, useEffect, useState, useLayoutEffect } from "react";
import { useDnD, useDnDTarget, useDnDSource, CanDragSessionHandler } from "./context";
import {
  toInteraction,
  GenericInteractionEvent,
  distanceInteraction
} from "./interaction";
import { DragSession } from "./DragSession";

export interface MouseHandleRenderProps<T extends Element> {
  readonly onMouseDown: React.MouseEventHandler<T>;
}

export const useDnDMouseSourceHandle = <T extends Element>(
  ref: React.RefObject<T | null | undefined>,
  threshold = 10
): MouseHandleRenderProps<T> => {
  const { begin } = useDnDSource();

  const onMouseDown = useCallback(
    (e: GenericInteractionEvent) => {
      const starting = toInteraction(ref.current, e);
      let running = false;
      const conn = begin(toInteraction(ref.current, e));

      const onMouseMove = (e: GenericInteractionEvent) => {
        running = running || (distanceInteraction(starting, toInteraction(ref.current, e)) > threshold);
        if (running) {
          conn.move(toInteraction(ref.current, e));
        }
      };
      const onMouseUp = (e: GenericInteractionEvent) => {
        running = running || (distanceInteraction(starting, toInteraction(ref.current, e)) > threshold);
        if (running) {
          conn.release(toInteraction(ref.current, e));
        }
      };

      const doc = document.documentElement;
      doc.addEventListener(`mouseup`, onMouseUp, {
        capture: true,
        passive: true
      });
      doc.addEventListener(`mousemove`, onMouseMove, {
        capture: true,
        passive: true
      });

      conn.on(`free`, () => {
        doc.removeEventListener(`mouseup`, onMouseUp, { capture: true });
        doc.removeEventListener(`mousemove`, onMouseMove, { capture: true });
      });

      e.stopPropagation();
      e.preventDefault();
    },
    [ref, begin]
  );

  return { onMouseDown };
};

export interface MouseTargetRenderProps<T extends Element> {
  readonly onMouseEnter?: React.MouseEventHandler<T>;
  readonly onMouseMove?: React.MouseEventHandler<T>;
  readonly onMouseLeave?: React.MouseEventHandler<T>;
}
export const useDnDMouseTargetContainer = <T extends Element>(
  ref: React.RefObject<T | null | undefined>,
  canDrop: CanDragSessionHandler,
): MouseTargetRenderProps<T> => {
  const { dropping } = useDnDTarget();

  const [hover, setHover] = useState(false);
  const onMouseEnter = useCallback(() => setHover(true), []);
  const onMouseLeave = useCallback(() => setHover(false), []);

  useLayoutEffect(() => {
    let session: DragSession | undefined = undefined;
    if (hover && dropping && canDrop(dropping.session)) {
      const onMouseMove = (e: GenericInteractionEvent) => {
        e.stopPropagation();
        if (session) {
          session.move(toInteraction(ref.current, e));
        } else {
          session = dropping.accept(toInteraction(ref.current, e));
        }
      };
      const onMouseUp = (e: GenericInteractionEvent) => {
        if (session) {
          session.release(toInteraction(ref.current, e));
        }
      };

      const doc = document.documentElement;
      doc.addEventListener(`mouseup`, onMouseUp, { capture: true });
      doc.addEventListener(`mousemove`, onMouseMove, { capture: true });
      return () => {
        if (session) {
          session.outside();
        }
        doc.removeEventListener(`mouseup`, onMouseUp, { capture: true });
        doc.removeEventListener(`mousemove`, onMouseMove, { capture: true });
      };
    }
  }, [dropping, hover]);

  return { onMouseEnter, onMouseLeave };
};
