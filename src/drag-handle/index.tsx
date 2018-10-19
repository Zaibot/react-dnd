import React from "react";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { IPosition, DataObject, DataKey } from "../utils";
import { SquashEvents } from "../internal";
import { DraggableByPointer, IDragEvent } from "../core/draggable-by-pointer";

export interface IDragHandleProps {
    readonly dataMeta?: DataObject;
    readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
    readonly children?: React.ReactNode;
    readonly innerRef?: React.Ref<any>;
}

export const DragHandle = withDraggableConsumer<IDragHandleProps>(class DragHandle extends React.Component<IDragHandleProps & IDraggableContext> {
    private events = new SquashEvents();

    public constructor(props: IDragHandleProps & IDraggableContext, context?: any) {
        super(props, context);

        this.onDataMeta = this.onDataMeta.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrage = this.onDrage.bind(this);
        this.onDragStarte = this.onDragStarte.bind(this);
        this.onDragEnde = this.onDragEnde.bind(this);
    }

    public render() {
        const { children, innerRef } = this.props;
        return (
            <DraggableByPointer onDrag={this.onDrag} onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} innerRef={innerRef}>
                {children}
            </DraggableByPointer>
        );
    }

    private onDataMeta() {
        if (this.props.onDataMeta) {
            const dataKey = this.props.dataKey;
            return this.props.onDataMeta({ dataKey });
        }
        const meta = this.props.dataMeta;
        return meta;
    }

    private onDrag(e: IDragEvent) {
        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        };
        this.events.push({ type: `drag`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), this.onDrage);
    }

    private onDragStart(e: IDragEvent) {
        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        };
        const meta = this.onDataMeta();
        this.events.push({ type: `dragstart`, position, meta }, (ev) => [`drag`, `dragend`].includes(ev.type), this.onDragStarte);
    }

    private onDragEnd(e: IDragEvent) {
        const position: IPosition = {
            left: e.clientX,
            top: e.clientY,
        };
        this.events.push({ type: `dragend`, position }, (ev) => [`dragend`].includes(ev.type), this.onDragEnde);
    }

    private onDrage(ev: { position: IPosition }) {
        this.props.onDrag({ position: ev.position });
    }

    private onDragStarte(ev: { position: IPosition, meta: any }) {
        this.props.onDragStart({ position: ev.position, dataMetaOverride: ev.meta });
    }

    private onDragEnde(ev: { position: IPosition }) {
        this.props.onDragEnd({ position: ev.position });
    }
});
