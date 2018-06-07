import * as React from "react";
import { IBounds, DataKey } from "../utils";

export interface IPositionInterface {
    onRef(key: DataKey, getBounds: (() => IBounds | null) | null): void;
    getPositions(): { key: DataKey; bounds: IBounds | null }[];
    getPosition(key: DataKey): IBounds | null;
}

export const { Consumer: PositionConsumer, Provider: PositionProvider } = React.createContext<IPositionInterface>({
    onRef() {
        console.warn(`[@zaibot/react-dnd] missing PositionContainer`);
    },
    getPosition() {
        console.warn(`[@zaibot/react-dnd] missing PositionContainer`);
        return null;
    },
    getPositions() {
        console.warn(`[@zaibot/react-dnd] missing PositionContainer`);
        return [];
    },
});
