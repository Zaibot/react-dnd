import React from "react";
import { IDraggableDragHandleProps } from "../draggable";

export interface IDragHandleProps {
    readonly children?: React.ReactNode;
    readonly dragHandleProps: IDraggableDragHandleProps;
}

export class DragHandle extends React.Component<IDragHandleProps> {
    public render() {
        const { dragHandleProps, children } = this.props;
        return (
            <div style={{ display: 'inline' }} {...dragHandleProps}>
                {children}
            </div>
        );
    }
}
