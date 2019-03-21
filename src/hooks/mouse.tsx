import { useCallback, useEffect, useState } from "react";
import { useDnD, useDnDTarget, useDnDSource } from "./context";
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
      const conn = begin(toInteraction(ref.current, e));

      const onMouseMove = (e: GenericInteractionEvent) => {
        conn.move(toInteraction(ref.current, e));
      };
      const onMouseUp = (e: GenericInteractionEvent) => {
        conn.release(toInteraction(ref.current, e));
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
  ref: React.RefObject<T | null | undefined>
): MouseTargetRenderProps<T> => {
  const { accept } = useDnDTarget();

  const [hover, setHover] = useState(false);
  const onMouseEnter = useCallback(() => setHover(true), []);
  const onMouseLeave = useCallback(() => setHover(false), []);

  useEffect(() => {
    let session: DragSession | undefined = undefined;
    if (accept) {
      if (hover) {
        const onMouseMove = (e: GenericInteractionEvent) => {
          if (session) {
            session.move(toInteraction(ref.current, e));
          } else {
            session = accept(toInteraction(ref.current, e));
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
    }
  }, [accept, hover]);

  return { onMouseEnter, onMouseLeave };
};
