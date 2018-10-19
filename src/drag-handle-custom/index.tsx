import React from "react";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { IPosition, DataObject, DataKey } from "../utils";
import { SquashEvents } from "../internal";

export interface IDragHandleCustomRenderProps {
    readonly handle: React.HTMLAttributes<HTMLElement>;
}
export interface IDragHandleCustomProps {
    readonly dataMeta?: DataObject;
    readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
    readonly children: (args: IDragHandleCustomRenderProps) => React.ReactNode;
}
export interface IDragHandleCustomState {
    readonly handle: React.HTMLAttributes<HTMLElement>;
}

export const DragHandleCustom = withDraggableConsumer<IDragHandleCustomProps>(
    class DragHandleCustom extends React.Component<IDragHandleCustomProps & IDraggableContext, IDragHandleCustomState> {
        private events = new SquashEvents();

        constructor(props: IDragHandleCustomProps & IDraggableContext, context?: any) {
            super(props, context);

            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerDown = this.onPointerDown.bind(this);
            this.onPointerUp = this.onPointerUp.bind(this);
            this.onDataMeta = this.onDataMeta.bind(this);

            this.state = {
                handle: {
                    onPointerMove: this.onPointerMove,
                    onPointerDown: this.onPointerDown,
                    onPointerUp: this.onPointerUp,
                },
            };
        }

        public render() {
            return this.props.children(this.state);
        }

        private onDataMeta() {
            if (this.props.onDataMeta) {
                const dataKey = this.props.dataKey;
                return this.props.onDataMeta({ dataKey });
            }
            const meta = this.props.dataMeta;
            return meta;
        }

        private onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `drag`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), this.onDragE);
        }

        private onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
            e.stopPropagation();

            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `dragstart`, position }, (ev) => [`drag`, `dragend`].includes(ev.type), this.onDragStartE);
        }

        private onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
            const position: IPosition = {
                left: e.clientX,
                top: e.clientY,
            }
            this.events.push({ type: `dragend`, position }, (ev) => [`dragend`].includes(ev.type), this.onDragEndE);
        }


        private onDragE(ev: { position: IPosition }) {
            this.props.onDrag({ position: ev.position });
        }
        private onDragStartE(ev: { position: IPosition }) {
            this.props.onDragStart({ position: ev.position, dataMetaOverride: this.onDataMeta() });
        }
        private onDragEndE(ev: { position: IPosition }) {
            this.props.onDragEnd({ position: ev.position });
        }
    });
