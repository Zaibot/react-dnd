import React from "react";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { IPosition } from "../utils";
import { SquashEvents, getEmptyImage } from "../internal";

export interface IDragHandleProps {
    readonly children?: React.ReactNode;
    readonly innerRef?: React.Ref<any>;
}

export const DragHandle = withDraggableConsumer<IDragHandleProps>(class DragHandle extends React.Component<IDragHandleProps & IDraggableContext> {
    private events = new SquashEvents();

    public render() {
        const { children, innerRef } = this.props;
        return (
            <div draggable onDrag={this.onDrag} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} ref={innerRef}>
                {children}
            </div>
        );
    }

    private onDrag = (e: React.DragEvent<HTMLDivElement>) => {
        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        }
        this.events.push({ type: `drag`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), ({ position }) => {
            this.props.onDrag({ position });
        });
    }
    private onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        // HTML5 dragging
        e.dataTransfer.setDragImage(getEmptyImage(), 0, 0);
        // TODO: implementation for setData
        e.dataTransfer.effectAllowed = 'move';
        e.stopPropagation();

        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        }
        this.events.push({ type: `dragstart`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), ({ position }) => {
            this.props.onDragStart({ position });
        });
    }
    private onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        }
        this.events.push({ type: `dragend`, position }, (ev) => [`dragend`].includes(ev.type), ({ position }) => {
            this.props.onDragEnd({ position });
        });
    }
});
