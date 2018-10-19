import React from "react";

export interface IDragEvent {
    readonly clientX: number;
    readonly clientY: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly target: EventTarget | null;
}

export interface ITouchAndMouseDraggableProps {
    readonly innerRef?: React.Ref<any>;
    readonly component?: React.ComponentType<{ onPointerDown: (e: React.MouseEvent<HTMLElement>) => void }>;
    readonly onDragStart: (e: IDragEvent) => void;
    readonly onDrag: (e: IDragEvent) => void;
    readonly onDragEnd: (e: IDragEvent) => void;
}

export class DraggableByPointer extends React.Component<ITouchAndMouseDraggableProps> {
    private dragging = false;

    constructor(props: ITouchAndMouseDraggableProps, context?: any) {
        super(props, context);
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
    }

    public render() {
        const Component = this.props.component || 'div';
        return (
            <Component onPointerDown={this.onPointerDown} ref={this.props.innerRef} style={{ userSelect: 'none' }}>
                {this.props.children}
            </Component>
        );
    }

    private onPointerDown(e: React.MouseEvent<HTMLElement>) {
        if (!this.dragging) {
            document.addEventListener(`pointermove`, this.onPointerMove);
            document.addEventListener(`pointerup`, this.onPointerUp);

            this.dragging = true;
            this.props.onDragStart(e);
            e.preventDefault();
        }
    }

    private onPointerMove(e: PointerEvent) {
        if (this.dragging) {
            this.props.onDrag(e);
            e.stopPropagation();
        }
    }

    private onPointerUp(e: PointerEvent) {
        if (this.dragging) {
            document.removeEventListener(`pointermove`, this.onPointerMove);
            document.removeEventListener(`pointerup`, this.onPointerUp);

            this.dragging = false;
            this.props.onDragEnd(e);
            e.stopPropagation();
        }
    }
}

export interface ITouchAndMouseDraggableCustomProps {
    readonly children?: (props: { onPointerDown: (e: React.MouseEvent<HTMLElement>) => void }) => React.ReactNode;
    readonly onDragStart: (e: IDragEvent) => void;
    readonly onDrag: (e: IDragEvent) => void;
    readonly onDragEnd: (e: IDragEvent) => void;
}

export class DraggableByPointerCustom extends React.Component<ITouchAndMouseDraggableCustomProps> {
    private dragging = false;

    constructor(props: ITouchAndMouseDraggableProps, context?: any) {
        super(props, context);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    public render() {
        if (!this.props.children) {
            return null;
        }
        return this.props.children({
            onPointerDown: this.onMouseDown,
        });
    }

    private onMouseDown(e: React.MouseEvent<HTMLElement>) {
        if (!this.dragging) {
            document.addEventListener(`pointermove`, this.onMouseMove);
            document.addEventListener(`pointerup`, this.onMouseUp);

            this.dragging = true;
            this.props.onDragStart(e);
            e.preventDefault();
        }
    }

    private onMouseMove(e: PointerEvent) {
        if (this.dragging) {
            this.props.onDrag(e);
            e.stopPropagation();
        }
    }

    private onMouseUp(e: PointerEvent) {
        if (this.dragging) {
            document.removeEventListener(`pointermove`, this.onMouseMove);
            document.removeEventListener(`pointerup`, this.onMouseUp);

            this.dragging = false;
            this.props.onDragEnd(e);
            e.stopPropagation();
        }
    }
}
