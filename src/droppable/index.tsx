import * as React from "react";
import { withDragAndDropData, IDraggingProviderRenderProps } from "../core";
import { RefMethod, AnyElement } from "../utils/react";
import { DataObject, IPosition, isPositionSame } from "../utils";
import { SquashEvents, Minus } from "../internal";

export type DroppingArgs = { droppingPosition: IPosition | null, droppingData: DataObject, droppingMeta: DataObject };
export interface IDroppableDragProps {
    readonly onMouseOver?: React.MouseEventHandler<AnyElement>;
    readonly onMouseLeave?: React.MouseEventHandler<AnyElement>;
    readonly onMouseUp?: React.MouseEventHandler<AnyElement>;
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

const mousyDragTypoish = (type: string) => {
    switch (type) {
        case 'mouseenter': return 'dragenter';
        case 'mouseleave': return 'dragleave';
        case 'mouseup': return 'drop';
        default: return type;
    }
};

class DroppableImpl extends React.Component<IDroppableProps & IDraggingProviderRenderProps, IDroppableState> {
    private dropping = false;
    private dropProps: IDroppableDragProps;
    private events = new SquashEvents();

    constructor(props: IDroppableProps & IDraggingProviderRenderProps, context?: any) {
        super(props, context);
        this.dropProps = {
            onMouseUp: this.onMouseUp.bind(this),
            onMouseOver: this.onMouseOver.bind(this),
            onMouseLeave: this.onMouseLeave.bind(this),
        };
    }

    public state: IDroppableState = {
        droppingData: null,
        droppingMeta: null,
        droppingPosition: null,
    }

    public render() {
        const { droppingData, droppingPosition, droppingMeta } = this.state;
        const isDropping = !!this.state.droppingData;
        const dropProps = this.dropProps;
        const trackingProps = {
            ref: this.props.refDroppable,
        };
        const children = this.props.children({
            dropProps,
            trackingProps,
            isDropping,
            droppingData,
            droppingPosition,
            droppingMeta,
        });
        return children;
    }

    private onMouseOver(e: React.DragEvent<AnyElement>) {
        this.events.push({ type: mousyDragTypoish(e.type), clientX: e.clientX, clientY: e.clientY }, (ev) => [`dragleave`, `dragover`].includes(ev.type), (ev) => {
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
                    this.emitDragOver({ droppingPosition: this.state.droppingPosition, droppingData: this.state.droppingData, droppingMeta: this.state.droppingMeta });
                }
            });
        });
    }

    private onMouseLeave(e: React.DragEvent<AnyElement>) {
        this.events.push({ type: mousyDragTypoish(e.type) }, (ev) => [`dragleave`, `dragover`].includes(ev.type), (ev) => {
            const droppingData = this.state.droppingData;
            const droppingMeta = this.state.droppingMeta;
            const droppingPosition = this.state.droppingPosition;
            this.setState({ droppingData: null, droppingMeta: null, droppingPosition: null }, () => {
                if (this.dropping) {
                    this.dropping = false;
                    this.emitDragOut({ droppingPosition, droppingData, droppingMeta });
                }
            });
        });
    }

    private onMouseUp(e: React.DragEvent<AnyElement>) {
        e.preventDefault();

        this.events.push({ type: mousyDragTypoish(e.type), clientX: e.clientX, clientY: e.clientY }, (ev) => [`dragleave`, `dragover`, `drop`].includes(ev.type), (ev) => {
            const droppingData = this.state.droppingData;
            const droppingMeta = this.state.droppingMeta;
            const droppingPosition = { left: ev.clientX, top: ev.clientY };
            this.setState({ droppingData: null, droppingPosition: null }, () => {
                if (this.dropping) {
                    this.dropping = false;
                    this.emitDrop({ droppingPosition, droppingData, droppingMeta });
                }
            });
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
