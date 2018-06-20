import * as React from "react";
import { withDragAndDropData, IDraggingConsumer } from "../dragging-provider";
import { RefMethod, AnyElement } from "../utils/react";
import { DataObject, IPosition, isPositionSame, Minus } from "../utils";

export interface IDroppableDragProps {
    readonly onDragOver?: React.DragEventHandler<AnyElement>;
    readonly onDragLeave?: React.DragEventHandler<AnyElement>;
    readonly onDrop?: React.DragEventHandler<AnyElement>;
}
export interface IDroppableTrackingProps {
    readonly ref?: RefMethod;
}
export interface IDroppableRenderProps {
    readonly dropProps: IDroppableDragProps;
    readonly trackingProps: IDroppableTrackingProps;
    readonly isDropping: boolean;
    readonly droppingData: DataObject;
    readonly droppingPosition: IPosition | null;
}
export interface IDroppableProps extends IDraggingConsumer {
    readonly refTracking?: RefMethod;
    readonly children: (args: IDroppableRenderProps) => React.ReactNode;
    readonly onDropping?: (args: { droppingPosition: IPosition, droppingData: DataObject }) => void;
    readonly onDropped?: (args: { droppingPosition: IPosition, droppingData: DataObject }) => void;
}
export interface IDroppableState {
    readonly droppingData: DataObject;
    readonly droppingPosition: IPosition | null;
}
class DroppableImpl extends React.Component<IDroppableProps, IDroppableState> {
    private dropProps: IDroppableDragProps;

    constructor(props: IDroppableProps, context?: any) {
        super(props, context);
        this.dropProps = {
            onDrop: this.onDrop.bind(this),
            onDragOver: this.onDragOver.bind(this),
            onDragLeave: this.onDragLeave.bind(this),
        };
    }

    public state: IDroppableState = {
        droppingData: null,
        droppingPosition: null,
    }

    public render() {
        const { droppingData, droppingPosition } = this.state;
        const isDropping = !!this.state.droppingData;
        const dropProps = this.dropProps;
        const trackingProps = {
            ref: this.props.refTracking,
        };
        const children = this.props.children({
            dropProps,
            trackingProps,
            isDropping,
            droppingData,
            droppingPosition,
        });
        return children;
    }

    private onDragOver(e: React.DragEvent<AnyElement>) {
        const droppingData = this.props.draggingData;
        const droppingPosition = { left: e.clientX, top: e.clientY };
        if (this.state.droppingData !== droppingData || !isPositionSame(this.state.droppingPosition, droppingPosition)) {
            this.setState({ droppingData, droppingPosition });
            if (this.props.onDropping) {
                this.props.onDropping({ droppingPosition, droppingData });
            }
        }
        e.preventDefault();
    }

    private onDragLeave(e: React.DragEvent<AnyElement>) {
        // console.log(`DroppableImpl.setState: onDragLeave`);
        this.setState({ droppingData: null, droppingPosition: null });
        e.preventDefault();
        // TODO: notify drop cancelled
    }

    private onDrop(e: React.DragEvent<AnyElement>) {
        // console.log(`DroppableImpl.setState: onDrop`);
        const droppingData = this.props.draggingData;
        const droppingPosition = { left: e.clientX, top: e.clientY };
        this.setState({ droppingData: null, droppingPosition: null });
        if (this.props.onDropped) {
            this.props.onDropped({ droppingPosition, droppingData });
        }
        e.preventDefault();
    }
}
export const Droppable = withDragAndDropData(DroppableImpl);

type OmitRenderProps<T> = Minus<T, IDroppableRenderProps>;
type OmitChildren<T> = Minus<T, { children?: any }>;

export const withDroppable = <Props extends IDroppableRenderProps>(component: React.ComponentType<Props>) => {
    const Component: any = component;
    const Wrapped: React.ComponentType<OmitChildren<IDroppableProps> & OmitRenderProps<Props>> = React.forwardRef(
        (props, ref) => {
            const { onDropped, onDropping, refTracking, ...extraProps } = props as any /* HACK: https://github.com/Microsoft/TypeScript/issues/12520 */;
            return (
                <Droppable onDropped={onDropped} onDropping={onDropping} refTracking={refTracking}>
                    {(positionProps) => <Component {...positionProps} {...extraProps} ref={ref} />}
                </Droppable>
            );
        });
    return Wrapped;
};
