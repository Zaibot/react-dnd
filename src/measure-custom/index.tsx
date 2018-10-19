import React from "react";
import { withDraggableConsumer, IDraggableContext, withDragAndDropData, IDraggingInterface } from "../core";
import { IBounds, emptyBounds, isBoundsSame, RefMethod } from "../utils";
import { getElementBoundsOrEmpty, defaultBatchMeasure } from "../internal";

export interface IMeasureCustomRenderProps {
    readonly bounds: IBounds;
    readonly refMeasure: RefMethod;
}
export interface IMeasureCustomWithProps {
    readonly refInner?: RefMethod;
    readonly onMeasured?: (bounds: IBounds) => void;
}
export interface IMeasureCustomProps {
    readonly refInner?: RefMethod;
    readonly onMeasured?: (bounds: IBounds) => void;
    readonly children?: (args: IMeasureCustomRenderProps) => React.ReactNode;
}

export interface IMeasureCustomState {
    readonly element: HTMLElement | null;
    readonly bounds: IBounds;
}

export const MeasureCustom = withDragAndDropData(
    withDraggableConsumer<IMeasureCustomProps & IDraggingInterface>(
        class MeasureCustom extends React.Component<IMeasureCustomProps & IDraggingInterface & IDraggableContext, IMeasureCustomState> {
            public state: IMeasureCustomState = {
                element: null,
                bounds: emptyBounds,
            };

            public constructor(props: IMeasureCustomProps & IDraggingInterface & IDraggableContext, context?: any) {
                super(props, context);

                this.onRef = this.onRef.bind(this);
                this.monitorWhileDragging = this.monitorWhileDragging.bind(this);
                this.monitorOnce = this.monitorOnce.bind(this);
                this.onBounds = this.onBounds.bind(this);
            }

            public componentWillUnmount() {
                defaultBatchMeasure.remove(this);
            }

            public componentDidMount() {
                this.monitorOnce();
            }

            public componentDidUpdate() {
                this.monitorOnce();
            }

            public render() {
                return this.props.children && this.props.children({ refMeasure: this.onRef, bounds: this.state.bounds });
            }

            private onRef(element: HTMLDivElement) {
                this.setState(({ element: oldElement }) => {
                    return oldElement === element ? null : { element };
                });
                if (this.props.refInner) {
                    this.props.refInner(element);
                }
            }

            private monitorWhileDragging() {
                if (this.props.isDragging && this.state.element) {
                    defaultBatchMeasure.push(this, this.state.element, this.onBounds);
                }
            }

            private monitorOnce() {
                if (this.state.element) {
                    defaultBatchMeasure.push(this, this.state.element, this.onBounds);
                }
            }

            private onBounds(bounds: IBounds) {
                this.props.reportMeasured(bounds);
                if (this.props.onMeasured) {
                    this.props.onMeasured(bounds);
                }
                this.setState(({ bounds: oldBounds }) => {
                    return isBoundsSame(oldBounds, bounds) ? null : { bounds };
                }, this.monitorWhileDragging);
            }
        }));

export const withMeasureCustom = <P extends {}>(Component: React.ComponentType<P & IMeasureCustomRenderProps>): React.ComponentType<P & IMeasureCustomWithProps> => {
    return ({ refInner, onMeasured, ...props }: any) => {
        return (
            <MeasureCustom refInner={refInner} onMeasured={onMeasured}>
                {(renderProps) => <Component {...props} {...renderProps} />}
            </MeasureCustom>
        );
    };
};
