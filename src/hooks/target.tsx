import React, { useState, useMemo, useEffect } from "react";
import { useDnD, DnDTargetContext, DndContextTargetInfo } from "./context";
import { DragSession } from "./DragSession";
import { Interaction } from "./interaction";

const useDnDTargetInfo = (meta?: any): DndContextTargetInfo => {
  const dnd = useDnD();
  const [session, setSession] = useState<DragSession | undefined>(undefined);
  const dropping = useMemo(() => {
    const newSession = dnd.session;
    return newSession && {
      session: newSession,
      accept: (interaction: Interaction) => {
        newSession.accept(meta, interaction);
        setSession(newSession);
        return newSession;
      },
      decline: (interaction: Interaction) => {
        newSession.decline(meta, interaction);
        setSession(newSession);
        return newSession;
      },
    };
  }, [dnd.session]);
  useEffect(() => {
    if (session) {
      const cleanup = () => setSession(undefined);
      session.on(`outside`, cleanup);
      session.on(`decline`, cleanup);
      session.on(`free`, cleanup);
      return () => {
        session.off(`outside`, cleanup);
        session.off(`decline`, cleanup);
        session.off(`free`, cleanup);
      };
    }
  }, [session]);
  return { meta, session, dropping };
};

export const DnDTarget = (props: { meta?: any; children: React.ReactNode }) => {
  const info = useDnDTargetInfo(props.meta);
  return (
    <DnDTargetContext.Provider value={info}>
      {props.children}
    </DnDTargetContext.Provider>
  );
};
