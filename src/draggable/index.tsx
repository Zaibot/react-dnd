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
    readonly component?: React.ComponentType<{ onMouseDown: (e: React.MouseEvent<HTMLElement>) => void }>;
    readonly onDragStart: (e: IDragEvent) => void;
    readonly onDrag: (e: IDragEvent) => void;
    readonly onDragEnd: (e: IDragEvent) => void;
}

export class TouchAndMouseDraggable extends React.Component<ITouchAndMouseDraggableProps> {
    private dragging = false;

    constructor(props: ITouchAndMouseDraggableProps, context?: any) {
        super(props, context);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    public componentDidMount() {
        document.addEventListener(`mousemove`, this.onMouseMove, { capture: true });
        document.addEventListener(`mouseup`, this.onMouseUp, { capture: true });
    }

    public componentWillUnmount() {
        document.addEventListener(`mousemove`, this.onMouseMove, { capture: true });
        document.addEventListener(`mouseup`, this.onMouseUp, { capture: true });
    }

    public render() {
        const Component = this.props.component || 'div';
        return (
            <Component onMouseDown={this.onMouseDown} ref={this.props.innerRef}>
                {this.props.children}
            </Component>
        );
    }

    private onMouseDown(e: React.MouseEvent<HTMLElement>) {
        if (!this.dragging) {
            this.dragging = true;
            this.props.onDragStart(e);
            e.preventDefault();
        }
    }

    private onMouseMove(e: MouseEvent) {
        if (this.dragging) {
            this.props.onDrag(e);
            e.preventDefault();
        }
    }
    
    private onMouseUp(e: MouseEvent) {
        if (this.dragging) {
            this.dragging = false;
            this.props.onDragEnd(e);
            e.preventDefault();
        }
    }
}

export interface ITouchAndMouseDroppableProps {
    readonly innerRef?: React.Ref<any>;
    readonly component?: React.ComponentType<{ onMouseDown: (e: React.MouseEvent<HTMLElement>) => void }>;
    readonly onDragStart: (e: IDragEvent) => void;
    readonly onDrag: (e: IDragEvent) => void;
    readonly onDragEnd: (e: IDragEvent) => void;
}

export class TouchAndMouseDroppable extends React.Component<ITouchAndMouseDroppableProps> {
    private dragging = false;

    constructor(props: ITouchAndMouseDroppableProps, context?: any) {
        super(props, context);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    public componentDidMount() {
        document.addEventListener(`mousemove`, this.onMouseMove);
        document.addEventListener(`mouseup`, this.onMouseUp);
    }

    public componentWillUnmount() {
        document.addEventListener(`mousemove`, this.onMouseMove);
        document.addEventListener(`mouseup`, this.onMouseUp);
    }

    public render() {
        const Component = this.props.component || 'div';
        return (
            <Component onMouseDown={this.onMouseDown} ref={this.props.innerRef}>
                {this.props.children}
            </Component>
        );
    }

    private onMouseDown(e: React.MouseEvent<HTMLElement>) {
        if (!this.dragging) {
            this.dragging = true;
            this.props.onDragStart(e);
            e.preventDefault();
        }
    }

    private onMouseMove(e: MouseEvent) {
        if (this.dragging) {
            this.props.onDrag(e);
            e.preventDefault();
        }
    }
    
    private onMouseUp(e: MouseEvent) {
        if (this.dragging) {
            this.dragging = false;
            this.props.onDragEnd(e);
            e.preventDefault();
        }
    }
}
