import React, { useState, useCallback, useMemo } from "react";
import { DndContextInfo, DnDContext } from "./context";
import { Interaction } from "./interaction";
import { DragSession } from "./DragSession";

export const DnDContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<DragSession | undefined>(undefined);
  const begin = useCallback((data: any, interaction: Interaction) => {
    const session = new DragSession(data, interaction);
    session.on(`free`, () => {
      setSession(current => (current === session ? undefined : current));
    });
    setSession(old => {
      if (old) {
        old.abort();
      }
      return session;
    });
    return session;
  }, []);
  const info = useMemo<DndContextInfo>(() => ({ session, begin }), [
    session,
    begin
  ]);
  return <DnDContext.Provider value={info}>{children}</DnDContext.Provider>;
};
