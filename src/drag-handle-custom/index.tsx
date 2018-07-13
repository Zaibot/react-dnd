import React from "react";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { IPosition, DataObject, DataKey } from "../utils";
import { SquashEvents, getEmptyImage } from "../internal";

export interface IDragHandleCustomProps {
    readonly dataMeta?: DataObject;
    readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
    readonly children: (args: { handle: React.HTMLAttributes<HTMLElement> }) => React.ReactNode;
}
export interface IDragHandleCustomState {
    readonly handle: React.HTMLAttributes<HTMLElement>;
}

export const DragHandleCustom = withDraggableConsumer<IDragHandleCustomProps>(
    class DragHandleCustom extends React.Component<IDragHandleCustomProps & IDraggableContext, IDragHandleCustomState> {
        private events = new SquashEvents();

        constructor(props: IDragHandleCustomProps & IDraggableContext, context?: any) {
            super(props, context);

            this.state = {
                handle: {
                    draggable: true,
                    onDrag: this.onDrag.bind(this),
                    onDragStart: this.onDragStart.bind(this),
                    onDragEnd: this.onDragEnd.bind(this),
                },
            };
        }

        public render() {
            return this.props.children(this.state);
        }

        private onDataMeta = () => {
            if (this.props.onDataMeta) {
                const dataKey = this.props.dataKey;
                return this.props.onDataMeta({ dataKey });
            }
            const meta = this.props.dataMeta;
            return meta;
        }

        private onDrag(e: React.DragEvent<HTMLDivElement>) {
            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `drag`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), ({ position }) => {
                this.props.onDrag({ position });
            });
        }

        private onDragStart(e: React.DragEvent<HTMLDivElement>) {
            // HTML5 dragging
            // TODO: implementation for setData
            e.dataTransfer.setDragImage(getEmptyImage(), 0, 0);
            e.dataTransfer.effectAllowed = 'move';
            e.stopPropagation();

            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `dragstart`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), ({ position }) => {
                this.props.onDragStart({ position, dataMetaOverride: this.onDataMeta() });
            });
        }

        private onDragEnd(e: React.DragEvent<HTMLDivElement>) {
            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `dragend`, position }, (ev) => [`dragend`].includes(ev.type), ({ position }) => {
                this.props.onDragEnd({ position });
            });
        }
    });
