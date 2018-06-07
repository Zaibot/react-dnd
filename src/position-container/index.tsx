import React from "react";
import { IPositionInterface, PositionProvider } from "../position-context";
import { RefMethod, DataKey, IBounds } from "../utils";

export interface IPositionRegistry {
    readonly key: DataKey;
    readonly getBounds: () => IBounds | null;
}

export interface IPositionChildProps {
    readonly getBounds: () => IBounds | null;
    readonly registries: IPositionRegistry[];
    readonly ref: RefMethod;
}

export interface IPositionContainerProps {
    readonly children: (props: IPositionChildProps) => React.ReactNode;
}

export interface IPositionContainerState {
    readonly element: HTMLElement | null;
    readonly registries: IPositionRegistry[];
}

export class PositionContainer extends React.Component<IPositionContainerProps, IPositionContainerState> implements IPositionInterface {
    private __registries: IPositionRegistry[] = [];
    public state: IPositionContainerState = {
        registries: this.__registries,
        element: null,
    };

    public constructor(props: IPositionContainerProps, context?: any) {
        super(props, context);

        this.onRef = this.onRef.bind(this);
        this.getPositions = this.getPositions.bind(this);
        this.getPosition = this.getPosition.bind(this);
        this.onContainerRef = this.onContainerRef.bind(this);
        this.getBounds = this.getBounds.bind(this);
    }

    public render() {
        const getBounds = this.getBounds;
        const ref = this.onContainerRef;
        const registries = this.state.registries;
        const children = this.props.children({ ref, getBounds, registries });
        return (
            <PositionProvider value={this}>
                {children}
            </PositionProvider>
        );
    }

    public onRef(key: DataKey, getBounds: () => IBounds | null) {
        if (getBounds) {
            const existing = this.__registries.find(({ key: keyItem, getBounds: getBoundsItem }) => key === keyItem && getBounds === getBoundsItem);
            if (existing) {
                // console.log(`PositionContainer.setState: onRef same`, key.id, getBounds ? `ok` : `nop`);
                return;
            }
            const reg = { key, getBounds };
            const appended = [...this.__registries.filter((k) => k.key !== key), reg];
            this.setState({ registries: this.__registries = appended });
            // console.log(`PositionContainer.setState: onRef`, key.id, getBounds ? `ok` : `nop`);
        } else {
            const existing = this.__registries.find(({ key: keyItem }) => key === keyItem);
            if (!existing) {
                // console.log(`PositionContainer.setState: onRef same`, key.id, getBounds ? `ok` : `nop`);
                return;
            }
            const removed = this.__registries.filter((k) => k.key !== key);
            this.setState({ registries: this.__registries = removed });
            // console.log(`PositionContainer.setState: onRef`, key.id, getBounds ? `ok` : `nop`);
        }
    }

    public getPositions(): { key: DataKey; bounds: IBounds | null; }[] {
        return this.__registries.map(({ key, getBounds }) => ({ key, bounds: getBounds() }));
    }

    public getPosition(key: DataKey): IBounds | null {
        const found = this.__registries.find(({ key: keyItem }) => key === keyItem);
        return found ? found.getBounds() : null;
    }

    private onContainerRef(element: HTMLElement) {
        // console.log(`PositionContainer.setState: onContainerRef`);
        if (this.state.element !== element) {
            this.setState({ element });
        }
    }

    private getBounds(): IBounds | null {
        return this.state.element ? this.state.element.getBoundingClientRect() : null;
    }
}
