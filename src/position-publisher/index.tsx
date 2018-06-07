import React from "react";
import { PositionConsumer } from "../position-context";
import { RefMethod, IBounds, DataKey, emptyBounds, AnyElement } from "../utils";

type Diff<T extends (string | number | symbol), U extends (string | number | symbol)> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

export interface IPositionPublisherProps {
    readonly refContainer?: RefMethod;
    readonly onRef: (key: DataKey, getBounds: (() => IBounds) | null) => void;
    readonly keyData: DataKey;
    readonly children: (props: {
        refContainer: RefMethod,
    }) => React.ReactNode;
}

class PositionPublisherImpl extends React.Component<IPositionPublisherProps> {
    private __element: AnyElement;
    constructor(props: IPositionPublisherProps, context?: any) {
        super(props, context);
        // console.log(`Made PositionPublisherImpl`);
        this.onRefContainer = this.onRefContainer.bind(this);
        this.getBounds = this.getBounds.bind(this);
    }
    public render() {
        const { children } = this.props;
        const refContainer = this.onRefContainer;
        return children({ refContainer });
    }
    private onRefContainer(element: AnyElement) {
        if (this.__element !== element) {
            this.__element = element;
            this.props.onRef(this.props.keyData, element ? this.getBounds : null);
            if (this.props.refContainer) { this.props.refContainer(element); }
        }
    }
    private getBounds(): IBounds {
        // console.log(this.props.keyData.id, this.__element)
        return this.__element ? this.__element.getBoundingClientRect() : emptyBounds;
    }
}
export const PositionPublisher = ({ children, ...props }: Omit<IPositionPublisherProps, "onRef">) => (
    <PositionConsumer>
        {({ onRef }) => (
            <PositionPublisherImpl {...props} onRef={onRef}>{children}</PositionPublisherImpl>
        )}
    </PositionConsumer>
);
