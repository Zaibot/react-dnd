import React from "react";
import { withDragAndDropData, IDraggingConsumer } from "../dragging-provider";
import { IPosition, RefMethod, IBounds, DataObject, isPositionSame, AnyElement } from "../utils";

let emptyImage: HTMLImageElement | undefined;
function getEmptyImage(): HTMLImageElement {
    if (!emptyImage) {
        emptyImage = new Image()
        emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    }
    return emptyImage
}
export interface IDraggableDragContainerProps {
    readonly style?: React.CSSProperties;
}
export interface IDraggableDragHandleProps {
    readonly draggable?: boolean;
    readonly onDrag?: React.DragEventHandler<AnyElement>;
    readonly onDragStart?: React.DragEventHandler<AnyElement>;
    readonly onDragEnd?: React.DragEventHandler<AnyElement>;
}
export interface IDraggableTrackingProps {
    readonly ref?: RefMethod;
}
export interface IDraggableChildProps {
    readonly dragContainerProps: IDraggableDragContainerProps,
    readonly dragHandleProps: IDraggableDragHandleProps,
    readonly trackingProps: IDraggableTrackingProps,
    readonly isDragging: boolean,
    readonly isDragged: boolean,
    readonly dragging: React.ReactNode,
    readonly bounds: IBounds | null,
    readonly touchPosition: IPosition | null,
}
export interface IDraggableProps extends IDraggingConsumer {
    readonly refTracking?: RefMethod;
    readonly dataDrag: DataObject;
    readonly children: (args: IDraggableChildProps) => React.ReactNode;
    readonly onDragStart?: () => void;
    readonly onDragMove?: () => void;
    readonly onDragEnd?: () => void;
}
export interface IDraggableState {
    readonly isDragging: boolean;
    readonly element: HTMLElement | null;
    readonly offsetWithinViewport: IPosition | null;
    readonly offsetWithinElement: IPosition | null;
}
class DraggableImpl extends React.Component<IDraggableProps, IDraggableState> {
    public state: IDraggableState = {
        isDragging: false,
        element: null,
        offsetWithinElement: null,
        offsetWithinViewport: null,
    }

    constructor(props: IDraggableProps, context?: any) {
        super(props, context);

        this.getBounds = this.getBounds.bind(this);
        this.onRefTracking = this.onRefTracking.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    public render() {
        return this.renderStatic();
    }

    private renderStatic() {
        const { isDragging } = this.state;
        const isDragged = false;
        const bounds = this.getBounds();
        const touchPosition = this.state.offsetWithinElement;
        const dragHandleProps: IDraggableDragHandleProps = {
            draggable: true,
            onDragStart: this.onDragStart,
            onDrag: this.onDrag,
            onDragEnd: this.onDragEnd,
        };
        const dragContainerProps: IDraggableDragContainerProps = {
        };
        const trackingProps: IDraggableTrackingProps = {
            ref: this.onRefTracking,
        };
        const dragging: React.ReactNode = isDragging ? this.renderDragging() : null;
        const children = this.props.children({
            dragHandleProps,
            dragContainerProps,
            trackingProps,
            isDragging,
            isDragged,
            dragging,
            bounds,
            touchPosition,
        });
        return children;
    }

    private renderDragging() {
        const { offsetWithinViewport } = this.state;
        const bounds = this.getBounds();
        if (!bounds) { console.warn(`[@zaibot/react-dnd] missing static bounds`); return; }
        if (!offsetWithinViewport) { console.warn(`[@zaibot/react-dnd] missing dragging offsets`); return; }
        const isDragging = true;
        const isDragged = true;
        const touchPosition = this.state.offsetWithinElement;
        const dragHandleProps: IDraggableDragHandleProps = {
        };
        const dragContainerProps: IDraggableDragContainerProps = {
            style: {
                pointerEvents: `none`,
                transform: `translate(${offsetWithinViewport.left}px, ${offsetWithinViewport.top}px)`,
                position: `fixed`,
                boxSizing: `border-box`, /* TODO: detect box sizing method instead of overriding? */
                top: `0`,
                left: `0`,
                width: `${bounds.width}px`,
                height: `${bounds.height}px`,
                zIndex: 999999,
            },
        };
        const trackingProps: IDraggableTrackingProps = {
        };
        const dragging: React.ReactNode = null;
        const children = this.props.children({
            dragHandleProps,
            dragContainerProps,
            trackingProps,
            isDragging,
            isDragged,
            dragging,
            bounds,
            touchPosition,
        });
        return children;
    }

    private onRefTracking(element: HTMLElement) {
        // console.log(`Draggable.onRefTracking`);
        if (this.state.element !== element) {
            this.setState({ element });
            if (this.props.refTracking) { this.props.refTracking(element); }
        }
    };

    private getBounds() {
        return this.state.element ? this.state.element.getBoundingClientRect() : null;
    }

    private onDragStart(e: React.DragEvent<HTMLElement>) {
        const bounds = this.getBounds();
        if (!bounds) { console.warn(`[@zaibot/react-dnd] missing static bounds`); return; }

        e.dataTransfer.setDragImage(getEmptyImage(), 0, 0);
        // TODO: implementation for setData
        e.dataTransfer.effectAllowed = 'move';

        const isDragging = true;
        const offsetWithinElement = {
            left: e.clientX - bounds.left,
            top: e.clientY - bounds.top,
        };
        const offsetWithinViewport = {
            left: e.clientX - offsetWithinElement!.left,
            top: e.clientY - offsetWithinElement!.top,
        };
        // HACK: Chrome bug, calling dragend; insert small gap before modifying dom
        setImmediate(() => {
            // console.log(`Draggable.setState: onDragStart`);
            this.setState({ isDragging, offsetWithinElement, offsetWithinViewport });
            this.props.onDragging(this.props.dataDrag);
        });
        e.stopPropagation();
    }

    private onDrag(e: React.DragEvent<HTMLElement>) {
        const { offsetWithinElement } = this.state;
        if (!offsetWithinElement) {
            // HACK: when called before setImmediate
            return;
        }
        const offsetWithinViewport = {
            left: e.clientX - this.state.offsetWithinElement!.left,
            top: e.clientY - this.state.offsetWithinElement!.top,
        };
        if (!isPositionSame(offsetWithinViewport, this.state.offsetWithinViewport)) {
            // console.log(`Draggable.setState: onDrag`);
            this.setState({ offsetWithinViewport });
        }
        e.stopPropagation();
    }
    private onDragEnd(e: React.DragEvent<HTMLElement>) {
        // console.log(`Draggable.setState: onDragEnd`);
        this.setState({ isDragging: false });
        this.props.onDragged();
        e.stopPropagation();
    }
}
export const Draggable = withDragAndDropData(DraggableImpl);
