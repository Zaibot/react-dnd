import { useDnD, DndContextItemInfo, DnDItemContext } from "./context";
import React, { useState, useCallback } from "react";
import { Interaction } from "./interaction";
import { DragSession } from "./DragSession";

const useDnDSourceInfo = (data: any): DndContextItemInfo => {
    const dnd = useDnD();
    const [session, setSession] = useState<DragSession | undefined>(undefined);

    const begin = useCallback((interaction: Interaction) => {
        const session = dnd.begin(data, interaction);
        session.on(`free`, () => {
            setSession(undefined);
        });
        setSession((old) => {
            if (old) {
                old.abort();
            }
            return session;
        });
        return session;
    }, []);

    return { begin, data, session };
}

export const DnDSource = (props: { data: {}, children: React.ReactNode }) => {
    const info = useDnDSourceInfo(props.data);
    return (
        <DnDItemContext.Provider value={info}>
            {props.children}
        </DnDItemContext.Provider>
    )
};
