import React from "react";
import { withDraggableConsumer, IDraggableContext, withDragAndDropData, IDraggingInterface } from "../core";
import { IBounds, emptyBounds, isBoundsSame, RefMethod } from "../utils";
import { getElementBoundsOrEmpty, defaultBatchMeasure } from "../internal";

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

            public static getDerivedStateFromProps(nextProps: IMeasureProps & IDraggingInterface & IDraggableContext, prevState: IMeasureState) {
                const bounds = getElementBoundsOrEmpty(prevState.element);
                nextProps.reportMeasured(bounds);
                if (nextProps.onMeasured) {
                    nextProps.onMeasured(bounds);
                }
                if (isBoundsSame(prevState.bounds, bounds)) {
                    return null;
                }
                return { bounds };
            }

            public componentDidUpdate() {
                this.monitorWhileDragging();
            }

            public render() {
                return <div ref={this.onRef}>{this.props.children}</div>;
            }

            public onRef = (el: HTMLDivElement) => {
                this.setState({ element: el });
                if (this.props.refInner) {
                    this.props.refInner(el);
                }
            }

            public monitorWhileDragging = () => {
                if (this.props.isDragging && this.state.element) {
                    defaultBatchMeasure.push(this, this.state.element, (bounds) => {
                        this.props.reportMeasured(bounds);
                        if (this.props.onMeasured) {
                            this.props.onMeasured(bounds);
                        }
                        this.setState({ bounds }, this.monitorWhileDragging);
                    });
                }
            }
        }));
