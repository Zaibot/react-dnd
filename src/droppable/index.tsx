import * as React from "react";
import { withDragAndDropData, IDraggingProviderRenderProps } from "../core";
import { RefMethod, AnyElement } from "../utils/react";
import { DataObject, IPosition, isPositionSame } from "../utils";
import { SquashEvents, Minus } from "../internal";

export type DroppingArgs = {
  droppingPosition: IPosition | null;
  droppingData: DataObject;
  droppingMeta: DataObject;
};
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
export interface IDroppableProps {
  readonly refDroppable?: RefMethod;
  readonly children: (args: IDroppableRenderProps) => React.ReactNode;
  readonly onDragOver?: (args: DroppingArgs) => void;
  readonly onDragOut?: (args: DroppingArgs) => void;
  readonly onDrop?: (args: DroppingArgs) => void;
}
export interface IDroppableState {
  readonly droppingData: DataObject;
  readonly droppingMeta: DataObject;
  readonly droppingPosition: IPosition | null;
}
class DroppableImpl extends React.Component<
  IDroppableProps & IDraggingProviderRenderProps,
  IDroppableState
> {
  private dropProps: IDroppableDragProps;
  private events = new SquashEvents();

  constructor(
    props: IDroppableProps & IDraggingProviderRenderProps,
    context?: any
  ) {
    super(props, context);
    this.dropProps = {
      onDrop: this.onDrop.bind(this),
      onDragOver: this.onDragOver.bind(this),
      onDragLeave: this.onDragLeave.bind(this)
    };
  }

  public state: IDroppableState = {
    droppingData: null,
    droppingMeta: null,
    droppingPosition: null
  };

  public render() {
    const { droppingData, droppingPosition, droppingMeta } = this.state;
    const isDropping = !!this.state.droppingData;
    const dropProps = this.dropProps;
    const trackingProps = {
      ref: this.props.refDroppable
    };
    const children = this.props.children({
      dropProps,
      trackingProps,
      isDropping,
      droppingData,
      droppingPosition,
      droppingMeta
    });
    return children;
  }

  private onDragOver(e: React.DragEvent<AnyElement>) {
    e.preventDefault();

    this.events.push(
      { type: e.type, clientX: e.clientX, clientY: e.clientY },
      ev => [`dragleave`, `dragover`].includes(ev.type),
      ev => {
        const draggingPosition = { left: ev.clientX, top: ev.clientY };
        this.setState(
          (
            { droppingPosition, droppingData, droppingMeta },
            { draggingMeta, draggingData }
          ) => {
            const shouldUpdate =
              !isPositionSame(droppingPosition, draggingPosition) ||
              droppingData !== draggingData ||
              droppingMeta !== draggingMeta;
            if (shouldUpdate) {
              droppingPosition = draggingPosition;
              droppingData = draggingData;
              droppingMeta = draggingMeta;
              return { droppingData, droppingPosition, droppingMeta };
            }
            return null;
          },
          () => {
            this.emitDragOver({
              droppingPosition: this.state.droppingPosition,
              droppingData: this.state.droppingData,
              droppingMeta: this.state.droppingMeta
            });
          }
        );
      }
    );
  }

  private onDragLeave(e: React.DragEvent<AnyElement>) {
    e.preventDefault();

    this.events.push(
      { type: e.type },
      ev => [`dragleave`, `dragover`].includes(ev.type),
      ev => {
        const droppingData = this.state.droppingData;
        const droppingMeta = this.state.droppingMeta;
        const droppingPosition = this.state.droppingPosition;
        this.setState(
          { droppingData: null, droppingMeta: null, droppingPosition: null },
          () => {
            this.emitDragOut({ droppingPosition, droppingData, droppingMeta });
          }
        );
      }
    );
  }

  private onDrop(e: React.DragEvent<AnyElement>) {
    e.preventDefault();

    this.events.push(
      { type: e.type, clientX: e.clientX, clientY: e.clientY },
      ev => [`dragleave`, `dragover`, `drop`].includes(ev.type),
      ev => {
        const droppingData = this.state.droppingData;
        const droppingMeta = this.state.droppingMeta;
        const droppingPosition = { left: ev.clientX, top: ev.clientY };
        this.setState({ droppingData: null, droppingPosition: null }, () => {
          this.emitDrop({ droppingPosition, droppingData, droppingMeta });
        });
      }
    );
  }

  private emitDragOver(args: DroppingArgs) {
    if (this.props.onDragOver) {
      this.props.onDragOver(args);
    }
  }
  private emitDragOut(args: DroppingArgs) {
    if (this.props.onDragOut) {
      this.props.onDragOut(args);
    }
  }
  private emitDrop(args: DroppingArgs) {
    if (this.props.onDrop) {
      this.props.onDrop(args);
    }
  }
}
export const Droppable = withDragAndDropData(DroppableImpl);

export const withDroppable = <P extends {}>(
  Inner: React.ComponentType<P & IDroppableRenderProps>
) =>
  React.forwardRef((props: P, ref) => {
    const {
        onDrop,
        onDragOver,
        onDragOut,
        onDragMove,
        refDroppable,
        ...extraProps
      } = props as any /* HACK: https://github.com/Microsoft/TypeScript/issues/12520 */;
    return (
      <Droppable
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragOut={onDragOut}
        refDroppable={refDroppable}
      >
        {positionProps => (
          <Inner {...positionProps} {...extraProps} ref={ref} />
        )}
      </Droppable>
    );
  });
