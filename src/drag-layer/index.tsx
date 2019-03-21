import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";
import { withDraggableConsumer, IDraggableContext } from "../core";
import { emptyPosition, emptyBounds, isBoundsSame } from "../utils";

export interface IDragLayerProps {
  // readonly clientLeft: number;
  // readonly clientTop: number;
  readonly copyBounds?: boolean;
  readonly width?: number;
  readonly height?: number;
  // readonly offsetLeft?: number;
  // readonly offsetTop?: number;
  readonly children?: React.ReactNode;
}
export interface IDragLayerState {
  readonly visible: boolean;
  readonly left: number | null;
  readonly top: number | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly style: React.CSSProperties;
}
export const DragLayer = withDraggableConsumer<IDragLayerProps>(
  class DragLayer extends React.Component<
    IDragLayerProps & IDraggableContext,
    IDragLayerState
  > {
    public static getDerivedStateFromProps(
      nextProps: IDragLayerProps & IDraggableContext,
      prevState: IDragLayerState
    ) {
      if (nextProps.draggingPosition) {
        const touchPosition = nextProps.touchPosition || emptyPosition;
        const left =
          nextProps.draggingPosition.left - (touchPosition.left || 0);
        const top = nextProps.draggingPosition.top - (touchPosition.top || 0);
        const width = nextProps.copyBounds
          ? nextProps.width
          : nextProps.bounds.width;
        const height = nextProps.copyBounds
          ? nextProps.height
          : nextProps.bounds.height;
        if (
          left !== prevState.left ||
          top !== prevState.top ||
          width !== prevState.width ||
          height !== prevState.height
        ) {
          const style: CSSProperties = {
            position: `fixed`,
            left: `${left}px`,
            top: `${top}px`,
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
            pointerEvents: `none`,
            zIndex: 99999999
          };
          return {
            left,
            top,
            width,
            height,
            style,
            visible: true
          };
        }
      } else if (prevState.visible) {
        return { visible: false };
      }
      return null;
    }

    constructor(props: IDragLayerProps & IDraggableContext, context?: any) {
      super(props, context);

      this.state = {
        visible: false,
        left: null,
        top: null,
        width: null,
        height: null,
        style: {}
      };
    }

    public render() {
      if (this.props.isDragging && this.state.visible) {
        return (
          <DragLayerPortal style={this.state.style}>
            {this.props.children}
          </DragLayerPortal>
        );
      }
      return null;
    }
  }
);

interface IDragLayerPortalProps {
  style?: React.CSSProperties;
}
interface IDragLayerPortalState {
  element: HTMLDivElement;
}
class DragLayerPortal extends React.Component<
  IDragLayerPortalProps,
  IDragLayerPortalState
> {
  constructor(props: IDragLayerPortalProps, context?: any) {
    super(props, context);

    const element = document.createElement(`div`);
    Object.assign(element.style, props.style);
    this.state = { element };
  }

  public static getDerivedStateFromProps(
    nextProps: IDragLayerPortalProps,
    prevState: IDragLayerPortalState
  ) {
    Object.assign(prevState.element.style, nextProps.style);
    return null;
  }

  public componentDidMount() {
    const { element } = this.state;
    Object.assign(element.style, this.props.style);
    document.body.appendChild(element);
  }

  public componentWillUnmount() {
    const { element } = this.state;
    document.body.removeChild(element);
  }

  public render() {
    return ReactDOM.createPortal(this.props.children, this.state.element);
  }
}
