import { useState, useDebugValue, useEffect } from "react";
import { DragSession } from "./DragSession";
import { DragInfo, DropInfo } from "./context";

export const useDragState = (session?: DragSession) => {
  const [dragging, setDragging] = useState<DragInfo | undefined>(undefined);
  const [dropping, setDropping] = useState<DropInfo | undefined>(undefined);
  const [dropped, setDropped] = useState<DropInfo | undefined>(undefined);

  useDebugValue(
    { dragging, dropping, dropped },
    ({ dragging, dropping, dropped }) =>
      `${dragging ? `dragging` : ``}, ${dropping ? `dropping` : ``}, ${
        dropped ? `dropped` : ``
      }`
  );

  useEffect(() => {
    if (session) {
      setDragging({
        origin: session.origin,
        current: session.current,
        data: session.data
      });
      setDropped(undefined);
      const free = () => {
        setDragging(undefined);
        setDropping(undefined);
      };
      const accept = ({ data, interaction }: any) => {
        setDropping(
          session.target &&
            session.target.accepted && {
              data: data,
              meta: session.target.accepted.meta,
              current: interaction,
              origin: session.origin
            }
        );
      };
      const move = ({ data, interaction }: any) => {
        setDragging({
          data: data,
          current: interaction,
          origin: session.origin
        });
        setDropping(
          session.target &&
            session.target.accepted && {
              data: data,
              meta: session.target.accepted.meta,
              current: interaction,
              origin: session.origin
            }
        );
      };
      const release = ({ data, target, interaction }: any) => {
        setDropping(undefined);
        if (target && target.accepted) {
          setDropped({
            data: data,
            current: interaction,
            origin: interaction,
            meta: target.accepted.meta
          });
        }
      };
      session.on(`free`, free);
      session.on(`accept`, accept);
      session.on(`move`, move);
      session.on(`release`, release);
      return () => {
        session.off(`free`, free);
        session.off(`accept`, accept);
        session.off(`move`, move);
        session.off(`release`, release);
        setDragging(undefined);
        setDropping(undefined);
      };
    }
  }, [session]);

  return { dragging, dropping, dropped };
};
