import React, { useState, useMemo, useEffect } from "react";
import { useDnD, DnDTargetContext, DndContextTargetInfo } from "./context";
import { DragSession } from "./DragSession";
import { Interaction } from "./interaction";

const useDnDTargetInfo = (meta?: any): DndContextTargetInfo => {
    const dnd = useDnD();
    const [session, setSession] = useState<DragSession | undefined>(undefined);
    const accept = useMemo(() => {
        if (dnd.session) {
            return (interaction: Interaction) => {
                dnd.session!.accept(meta, interaction);
                setSession(dnd.session!);
                return dnd.session!;
            }
        }
    }, [dnd.session]);
    const decline = useMemo(() => {
        if (dnd.session) {
            return (interaction: Interaction) => {
                dnd.session!.decline(meta, interaction);
                setSession(dnd.session!);
                return dnd.session!;
            }
        }
    }, [dnd.session]);
    useEffect(() => {
        if (session) {
            const cleanup = () => setSession(undefined);
            session.on(`outside`, cleanup);
            session.on(`decline`, cleanup);
            return () => {
                session.off(`outside`, cleanup);
                session.off(`decline`, cleanup);
            };
        }
    }, [session]);
    return { meta, session, accept, decline };
}

export const DnDTarget = (props: { meta?: any, children: React.ReactNode }) => {
    const info = useDnDTargetInfo(props.meta);
    return (
        <DnDTargetContext.Provider value={info}>
            {props.children}
        </DnDTargetContext.Provider>
    );
};
