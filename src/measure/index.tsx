import React from "react";
import { withDraggableConsumer, IDraggableContext, withDragAndDropData, IDraggingInterface } from "../core";
import { IBounds, emptyBounds, isBoundsSame, RefMethod } from "../utils";
import { defaultBatchMeasure } from "../internal";

export interface IMeasureProps {
    readonly refInner?: RefMethod;
    readonly onMeasured?: (bounds: IBounds) => void;
}

export interface IMeasureState {
    readonly element: HTMLElement | null;
    readonly bounds: IBounds;
}

export const Measure = withDragAndDropData(
    withDraggableConsumer<IMeasureProps & IDraggingInterface>(
        class Measure extends React.Component<IMeasureProps & IDraggingInterface & IDraggableContext, IMeasureState> {
            public state: IMeasureState = {
                element: null,
                bounds: emptyBounds,
            };

            public constructor(props: IMeasureProps & IDraggingInterface & IDraggableContext, context?: any) {
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
                return <div ref={this.onRef}>{this.props.children}</div>;
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
