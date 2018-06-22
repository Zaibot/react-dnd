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
    readonly droppingMeta: DataObject;
    readonly droppingPosition: IPosition | null;
}
export interface IDroppableProps extends IDraggingConsumer {
    readonly refTracking?: RefMethod;
    readonly children: (args: IDroppableRenderProps) => React.ReactNode;
    readonly onDragOver?: (args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) => void;
    readonly onDragMove?: (args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) => void;
    readonly onDragOut?: (args: { droppingPosition: IPosition | null, droppingData: DataObject, droppingMeta: DataObject }) => void;
    readonly onDrop?: (args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) => void;
}
export interface IDroppableState {
    readonly droppingData: DataObject;
    readonly droppingMeta: DataObject;
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
        droppingMeta: null,
        droppingPosition: null,
    }

    public render() {
        const { droppingData, droppingPosition, droppingMeta } = this.state;
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
            droppingMeta,
        });
        return children;
    }

    private onDragOver(e: React.DragEvent<AnyElement>) {
        e.preventDefault();

        const droppingData = this.props.draggingData;
        const droppingMeta = this.props.draggingMeta;
        const droppingPosition = { left: e.clientX, top: e.clientY };
        const shouldUpdate =
            this.state.droppingData !== droppingData
            || this.state.droppingMeta !== droppingMeta
            || !isPositionSame(this.state.droppingPosition, droppingPosition);
        if (shouldUpdate) {
            if (this.state.droppingData) {
                this.emitDragMove({ droppingPosition, droppingData, droppingMeta });
            } else {
                this.emitDragOver({ droppingPosition, droppingData, droppingMeta });
            }
            this.setState({ droppingData, droppingPosition, droppingMeta });
        }
    }

    private emitDragOver(args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) {
        if (this.props.onDragOver) {
            this.props.onDragOver(args);
        }
    }
    private emitDragOut(args: { droppingPosition: IPosition | null, droppingData: DataObject, droppingMeta: DataObject }) {
        if (this.props.onDragOut) {
            this.props.onDragOut(args);
        }
    }
    private emitDragMove(args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) {
        if (this.props.onDragMove) {
            this.props.onDragMove(args);
        }
    }
    private emitDrop(args: { droppingPosition: IPosition, droppingData: DataObject, droppingMeta: DataObject }) {
        if (this.props.onDrop) {
            this.props.onDrop(args);
        }
    }

    private onDragLeave(e: React.DragEvent<AnyElement>) {
        e.preventDefault();

        const droppingData = this.state.droppingData;
        const droppingMeta = this.state.droppingMeta;
        const droppingPosition = this.state.droppingPosition;
        this.emitDragOut({ droppingPosition, droppingData, droppingMeta });
        this.setState({ droppingData: null, droppingPosition: null });
    }

    private onDrop(e: React.DragEvent<AnyElement>) {
        e.preventDefault();

        const droppingData = this.props.draggingData;
        const droppingMeta = this.props.draggingMeta;
        const droppingPosition = { left: e.clientX, top: e.clientY };
        this.emitDrop({ droppingPosition, droppingData, droppingMeta });
        this.setState({ droppingData: null, droppingPosition: null });
    }
}
export const Droppable = withDragAndDropData(DroppableImpl);

type OmitRenderProps<T> = Minus<T, IDroppableRenderProps>;
type OmitChildren<T> = Minus<T, { children?: any }>;

export const withDroppable = <Props extends IDroppableRenderProps>(component: React.ComponentType<Props>) => {
    const Component: any = component;
    const Wrapped: React.ComponentType<OmitChildren<IDroppableProps> & OmitRenderProps<Props>> = React.forwardRef(
        (props, ref) => {
            const { onDrop, onDragOver, onDragOut, onDragMove, refTracking, ...extraProps } = props as any /* HACK: https://github.com/Microsoft/TypeScript/issues/12520 */;
            return (
                <Droppable
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragOut={onDragOut}
                    onDragMove={onDragMove}
                    refTracking={refTracking}>
                    {(positionProps) => <Component {...positionProps} {...extraProps} ref={ref} />}
                </Droppable>
            );
        });
    return Wrapped;
};
