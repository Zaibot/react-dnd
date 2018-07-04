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

            public static getDerivedStateFromProps(nextProps: IMeasureCustomProps & IDraggingInterface & IDraggableContext, prevState: IMeasureCustomState) {
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
                return this.props.children && this.props.children({ refMeasure: this.onRef, bounds: this.state.bounds });
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
                        this.setState(({ bounds: boundsOld }) => {
                            if (isBoundsSame(boundsOld, bounds)) {
                                return null;
                            }
                            return { bounds };
                        }, this.monitorWhileDragging);
                    });
                }
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
