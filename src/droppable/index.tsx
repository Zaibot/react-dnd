import * as React from "react";
import { withDragAndDropData, IDraggingProviderRenderProps } from "../core";
import { RefMethod, AnyElement } from "../utils/react";
import { DataObject, IPosition, isPositionSame } from "../utils";
import { SquashEvents, Minus } from "../internal";

export type DroppingArgs = { droppingPosition: IPosition | null, droppingData: DataObject, droppingMeta: DataObject };
export interface IDroppableDragProps {
    readonly onPointerOver?: React.MouseEventHandler<AnyElement>;
    readonly onPointerLeave?: React.MouseEventHandler<AnyElement>;
    readonly onPointerUp?: React.MouseEventHandler<AnyElement>;
}
export interface IDroppableTrackingProps {
    readonly ref?: RefMethod;
}
export interface IDroppableRenderProps {
    readonly dropProps: IDroppableDragProps;
    readonly trackingProps: IDroppableTrackingProps;
    readonly isDropping: boolean;
    readonly droppingData: DataObject;
    readonly droppingMeta: DataObject;
    readonly droppingPosition: IPosition | null;
}
export interface IDroppableProps {
    readonly refDroppable?: RefMethod;
    readonly children: (args: IDroppableRenderProps) => React.ReactNode;
    readonly onDragOver?: (args: DroppingArgs) => void;
    readonly onDragOut?: (args: DroppingArgs) => void;
    readonly onDrop?: (args: DroppingArgs) => void;
}
export interface IDroppableState {
    readonly droppingData: DataObject;
    readonly droppingMeta: DataObject;
    readonly droppingPosition: IPosition | null;
}

class DroppableImpl extends React.Component<IDroppableProps & IDraggingProviderRenderProps, IDroppableState> {
    private dropping = false;
    private events = new SquashEvents();

    constructor(props: IDroppableProps & IDraggingProviderRenderProps, context?: any) {
        super(props, context);
        this.onLeave = this.onLeave.bind(this);
        this.onOver = this.onOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onPointerOver = this.onPointerOver.bind(this);
        this.onPointerLeave = this.onPointerLeave.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
    }

    public state: IDroppableState = {
        droppingData: null,
        droppingMeta: null,
        droppingPosition: null,
    }

    public render() {
        const { droppingData, droppingPosition, droppingMeta } = this.state;
        const isDropping = !!this.state.droppingData;
        const children = this.props.children({
            dropProps: {
                onPointerOver: this.onPointerOver,
                onPointerLeave: this.onPointerLeave,
                onPointerUp: this.onPointerUp,
            },
            trackingProps: {
                ref: this.props.refDroppable,
            },
            isDropping,
            droppingData,
            droppingPosition,
            droppingMeta,
        });
        return children;
    }

    private onPointerOver(e: React.DragEvent<AnyElement>) {
        this.events.push({ type: `over`, clientX: e.clientX, clientY: e.clientY }, (ev) => [`leave`, `over`].includes(ev.type), this.onOver);
    }

    private onPointerLeave(e: React.DragEvent<AnyElement>) {
        this.events.push({ type: `leave` }, (ev) => [`leave`, `over`].includes(ev.type), this.onLeave);
    }

    private onPointerUp(e: React.DragEvent<AnyElement>) {
        this.events.push({ type: `drop`, clientX: e.clientX, clientY: e.clientY }, (ev) => [`leave`, `over`, `drop`].includes(ev.type), this.onDrop);
    }

    private onOver(ev: { clientX: number, clientY: number }) {
        const draggingPosition = { left: ev.clientX, top: ev.clientY };
        this.setState(({ droppingPosition, droppingData, droppingMeta }, { draggingMeta, draggingData }) => {
            const shouldUpdate = !isPositionSame(droppingPosition, draggingPosition)
                || droppingData !== draggingData
                || droppingMeta !== draggingMeta;
            if (shouldUpdate) {
                droppingPosition = draggingPosition;
                droppingData = draggingData;
                droppingMeta = draggingMeta;
                return { droppingData, droppingPosition, droppingMeta };
            }
            return null;
        }, () => {
            if (this.state.droppingData) {
                this.dropping = true;
                this.emitDragOver({
                    droppingPosition: this.state.droppingPosition,
                    droppingData: this.state.droppingData,
                    droppingMeta: this.state.droppingMeta,
                });
            }
        });
    }

    private onLeave(_ev: {}) {
        const droppingData = this.state.droppingData;
        const droppingMeta = this.state.droppingMeta;
        const droppingPosition = this.state.droppingPosition;
        this.setState({ droppingData: null, droppingMeta: null, droppingPosition: null }, () => {
            if (this.dropping) {
                this.dropping = false;
                this.emitDragOut({
                    droppingPosition,
                    droppingData,
                    droppingMeta,
                });
            }
        });
    }

    private onDrop(ev: { clientX: number, clientY: number }) {
        const droppingData = this.state.droppingData;
        const droppingMeta = this.state.droppingMeta;
        const droppingPosition = { left: ev.clientX, top: ev.clientY };
        this.setState({ droppingData: null, droppingPosition: null }, () => {
            if (this.dropping) {
                this.dropping = false;
                this.emitDrop({
                    droppingPosition,
                    droppingData,
                    droppingMeta,
                });
            }
        });
    }

    private emitDragOver(args: DroppingArgs) {
        if (this.props.onDragOver) {
            this.props.onDragOver(args);
        }
    }

    private emitDragOut(args: DroppingArgs) {
        if (this.props.onDragOut) {
            this.props.onDragOut(args);
        }
    }

    private emitDrop(args: DroppingArgs) {
        if (this.props.onDrop) {
            this.props.onDrop(args);
        }
    }
}
export const Droppable = withDragAndDropData(DroppableImpl);

type OmitRenderProps<T> = Minus<T, IDroppableRenderProps>;
type OmitChildren<T> = Minus<T, { children: IDroppableProps['children'] }>;

export const withDroppable = <P extends IDroppableRenderProps>(component: React.ComponentType<P>) => {
    const Component: any = component;
    const Wrapped: React.ComponentType<OmitRenderProps<P> & OmitChildren<IDroppableProps>> = React.forwardRef(
        (props, ref) => {
            const { onDrop, onDragOver, onDragOut, onDragMove, refDroppable, ...extraProps } = props as any /* HACK: https://github.com/Microsoft/TypeScript/issues/12520 */;
            return (
                <Droppable
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragOut={onDragOut}
                    refDroppable={refDroppable}>
                    {(positionProps) => <Component {...positionProps} {...extraProps} ref={ref} />}
                </Droppable>
            );
        });
    return Wrapped;
};
