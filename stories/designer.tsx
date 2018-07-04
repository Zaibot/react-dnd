import React from "react";
import { storiesOf } from "@storybook/react";
import { IDroppableRenderProps, withDroppable } from "../src/droppable";
import { DragHandle } from "../src/drag-handle";
import { DraggableContext, DraggingProvider } from "../src/core";
import { action } from "@storybook/addon-actions";
import { DataObject, IPosition, DataKey, IBounds, isBoundsSame, emptyBounds } from "../src/utils";
import { DragLayer } from "../src/drag-layer";
import { closestCorner } from "../src/strategy-closest-corner";
import { ClosestCornerLocation } from "../src/strategy-closest-corner/all";
import { withContentRect, MeasuredComponentProps } from 'react-measure';

const stories = storiesOf("react-dnd/Designer", module);

const locationToString = (location: ClosestCornerLocation) => {
  switch (location) {
    case ClosestCornerLocation.TopLeft: return `Top Left`;
    case ClosestCornerLocation.Top: return `Top`;
    case ClosestCornerLocation.TopRight: return `Top Right`;
    case ClosestCornerLocation.MiddleLeft: return `Middle Left`;
    case ClosestCornerLocation.Middle: return `Middle`;
    case ClosestCornerLocation.MiddleRight: return `Middle Right`;
    case ClosestCornerLocation.BottomLeft: return `Bottom Left`;
    case ClosestCornerLocation.Bottom: return `Bottom`;
    case ClosestCornerLocation.BottomRight: return `Bottom Right`;
    default: return `???`;
  }
}

const Yellow = (props: React.HTMLProps<HTMLDivElement>) => <div
  {...props}
  style={{ ...props.style, background: `#ffa`, display: `inline-block`, margin: `1rem` }} />;

interface IContainerProps {
  readonly draggingKey: DataObject;
  readonly draggingPosition: IPosition;
}
type R = { key: any, location: ClosestCornerLocation, distance: number };
interface IContainerState {
  readonly draggingPosition: IPosition;
  readonly highlight: R;
  readonly designerLocation: IDesignerLocation;
}

interface IDesignerPosition {
  readonly key: DataKey;
  readonly bounds: IBounds;
}
interface IDesignerLocation {
  readonly positions: IDesignerPosition[];
  readonly measured: (arg: IDesignerPosition) => void;
  readonly remove: (arg: { key: DataKey }) => void;
}
const emptyDesignerLocation: IDesignerLocation = {
  positions: [],
  measured: () => { /*console.warn(`IDesignerLocation.measured: noop`);*/ },
  remove: () => { /*console.warn(`IDesignerLocation.remove: noop`);*/ },
};
const { Provider: DesignerLocationProvider, Consumer: DesignerLocationConsumer } = React.createContext(emptyDesignerLocation);
type DesignerComponent<T> = React.ComponentType<T & IDesignerLocation>;
const withDesignerLocationConsumer = <T extends {}>(Component: DesignerComponent<T>): React.ComponentType<T> => {
  return (props: T) => (
    <DesignerLocationConsumer>
      {(designerProps) => (<Component {...props} {...designerProps} />)}
    </DesignerLocationConsumer>
  )
}
const not = <T extends {}>(fn: (arg: T) => boolean) => (arg: T): boolean => !fn(arg);
const isKey = (key: DataKey) => (arg: IDesignerPosition) => key === arg.key;
const Container = withContentRect(`client`)<IContainerProps>(withDroppable(
  class Impl extends React.Component<IContainerProps & MeasuredComponentProps & IDroppableRenderProps, IContainerState> {
    public static getDerivedStateFromProps(nextProps: IContainerProps & MeasuredComponentProps & IDroppableRenderProps, prevState: IContainerState) {
      if (nextProps.draggingPosition !== prevState.draggingPosition) {
        if (nextProps.draggingPosition) {
          const highlight = prevState.designerLocation.positions
            .map(({ bounds, key }) => ({ key, bounds, closestCorner: closestCorner.all(nextProps.draggingPosition, bounds, 8) }))
            .filter(({ closestCorner }) => !!closestCorner)
            .reduce<R>((s, { key, closestCorner: { distance, location } }) =>
              (s === null || distance < s.distance)
                ? ({ key, location, distance })
                : s,
              null);
          return { draggingPosition: nextProps.draggingPosition, highlight };
        } else {
          return { draggingPosition: null, highlight: null };
        }
      }
      return null;
    }

    constructor(props: IContainerProps & MeasuredComponentProps & IDroppableRenderProps, context?: any) {
      super(props, context);
      this.state = {
        draggingPosition: null,
        highlight: null,
        designerLocation: {
          positions: [],
          measured: this.onMeasured,
          remove: this.onRemoved,
        },
      };
    }

    public render() {
      const { measureRef, children } = this.props;
      const { highlight, designerLocation } = this.state;
      return (
        <DesignerLocationProvider value={designerLocation}>
          <div ref={measureRef}>
            <div>
              {highlight ? `${highlight.key}:${locationToString(highlight.location)}` : `-`}
            </div>
            {children}
          </div>
        </DesignerLocationProvider>
      )
    }

    onMeasured = ({ key, bounds }: { key: DataKey, bounds: IBounds }) => {
      // this.setState(({ designerLocation: { measured, positions, remove } }) => {
      //   const existing = positions.find(isKey(key));
      //   if (existing) {
      //     if (isBoundsSame(bounds, existing.bounds)) {
      //       return null;
      //     }
      //   }
      //   positions = positions.filter(not(isKey(key))).concat({ key, bounds });
      //   const designerLocation = { measured, remove, positions }
      //   return { designerLocation };
      // });
    }

    onRemoved = ({ key }: { key: DataKey }) => {
      this.setState(({ designerLocation: { measured, positions, remove } }) => {
        const existing = positions.find(isKey(key));
        if (!existing) {
          return null;
        }
        positions = positions.filter(not(isKey(key)));
        const designerLocation = { measured, remove, positions }
        return { designerLocation };
      });
    }
  }
));
interface IDroppableProps {
  readonly children: (args: {
    readonly droppingData: DataObject;
    readonly droppingPosition: IPosition;
  }) => void;
}
const Droppable = withDroppable(
  class Impl extends React.Component<IDroppableProps & IDroppableRenderProps> {
    public render() {
      const { children, droppingData, droppingMeta, droppingPosition, dropProps, isDropping, trackingProps } = this.props;
      return (
        <div ref={trackingProps.ref} {...dropProps}>
          <div>
            {droppingData || `-`}
          </div>
          {children({ droppingData, droppingPosition })}
        </div>
      )
    }
  }
);

interface IDesignerDraggableProps {
  readonly keyData: DataObject;
}
const DesignerDraggable = withContentRect(`bounds`)<IDesignerDraggableProps>(withDesignerLocationConsumer(
  class Impl extends React.Component<IDesignerDraggableProps & MeasuredComponentProps & IDesignerLocation> {
    public componentDidUpdate() {
      const key = this.props.keyData;
      const bounds = this.props.contentRect.bounds;
      this.props.measured({ key, bounds });
    }

    public render() {
      const { keyData, children, contentRect } = this.props;
      const bounds = contentRect.bounds || emptyBounds;
      return (
        <DraggableContext dataKey={keyData} bounds={this.props.contentRect.bounds}>
          <DragLayer width={bounds.width} height={bounds.height}>
            {children}
          </DragLayer>
          <DragHandle innerRef={this.props.measureRef}>
            {children}
          </DragHandle>
        </DraggableContext>
      );
    }
  }));


stories
  .add(`Designer`, () => (
    <DraggingProvider>
      <Droppable onDragOver={action(`Droppable.onDragOver`)} onDragOut={action(`Droppable.onDragOut`)} onDrop={action(`Droppable.onDrop`)}>
        {({ droppingData, droppingPosition }) => (
          <Container draggingKey={droppingData} draggingPosition={droppingPosition}>
            <DesignerDraggable keyData={1}>
              <Yellow>Test 1</Yellow>
            </DesignerDraggable>
            <DesignerDraggable keyData={2}>
              <Yellow>Test 2</Yellow>
            </DesignerDraggable>
            <DesignerDraggable keyData={3}>
              <Yellow>Test 3</Yellow>
            </DesignerDraggable>
            <DesignerDraggable keyData={4}>
              <Yellow>Test 4</Yellow>
            </DesignerDraggable>
            <DesignerDraggable keyData={5}>
              <Yellow>Test 5</Yellow>
            </DesignerDraggable>
          </Container>
        )}
      </Droppable>
      <hr />
      <DesignerDraggable keyData={6}>
        <Yellow>Drag In 1</Yellow>
      </DesignerDraggable>
    </DraggingProvider>
  ));
