import React from "react";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { IPosition, DataObject, DataKey } from "../utils";
import { SquashEvents, getEmptyImage } from "../internal";

export interface IDragHandleProps {
  readonly dataMeta?: DataObject;
  readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
  readonly children?: React.ReactNode;
  readonly innerRef?: React.Ref<any>;
}

export const DragHandle = withDraggableConsumer<IDragHandleProps>(
  class DragHandle extends React.Component<
    IDragHandleProps & IDraggableContext
  > {
    private events = new SquashEvents();

    public render() {
      const { children, innerRef } = this.props;
      return (
        <div
          draggable
          onDrag={this.onDrag}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          ref={innerRef}
        >
          {children}
        </div>
      );
    }

    private onDataMeta = () => {
      if (this.props.onDataMeta) {
        const dataKey = this.props.dataKey;
        return this.props.onDataMeta({ dataKey });
      }
      const meta = this.props.dataMeta;
      return meta;
    };

    private onDrag = (e: React.DragEvent<HTMLDivElement>) => {
      const position: IPosition = {
        left: e.clientX,
        top: e.clientY
      };
      this.events.push(
        { type: `drag`, position },
        ev => [`drag`, `dragend`].includes(ev.type),
        ({ position }) => {
          this.props.onDrag({ position });
        }
      );
    };
    private onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      // HTML5 dragging
      e.dataTransfer.setDragImage(getEmptyImage(), 0, 0);
      // TODO: implementation for setData
      e.dataTransfer.effectAllowed = "move";
      e.stopPropagation();

      const position: IPosition = {
        left: e.clientX,
        top: e.clientY
      };
      const meta = this.onDataMeta();
      this.events.push(
        { type: `dragstart`, position },
        ev => [`drag`, `dragend`].includes(ev.type),
        ({ position }) => {
          this.props.onDragStart({ position, dataMetaOverride: meta });
        }
      );
    };
    private onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      const position: IPosition = {
        left: e.clientX,
        top: e.clientY
      };
      this.events.push(
        { type: `dragend`, position },
        ev => [`dragend`].includes(ev.type),
        ({ position }) => {
          this.props.onDragEnd({ position });
        }
      );
    };
  }
);
