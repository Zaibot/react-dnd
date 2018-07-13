import * as React from "react";
import { DataObject } from "../../utils";

export interface IDraggingInterface {
    draggingData: DataObject;
    draggingMeta: DataObject;
    onDragStartInterface: (args: { data: DataObject, meta: DataObject }) => void;
    onDragEndInterface: () => void;
}

const context = React.createContext<IDraggingInterface>({
    draggingMeta: null,
    draggingData: null,
    onDragStartInterface() {
        console.warn(`[@zaibot/react-dnd] missing DraggingProvider`);
    },
    onDragEndInterface() {
        console.warn(`[@zaibot/react-dnd] missing DraggingProvider`);
    },
});

export interface IDraggingProviderRenderProps {
    draggingData: DataObject;
    draggingMeta: DataObject;
    onDragStartInterface: (args: { data: DataObject, meta: DataObject }) => void;
    onDragEndInterface: () => void;
}

export interface IDraggingProviderProps {
    readonly children: React.ReactNode;
}

export class DraggingProvider extends React.Component<IDraggingProviderProps, IDraggingInterface> {
    constructor(props: IDraggingProviderProps, context?: any) {
        super(props, context);

        this.onDragging = this.onDragging.bind(this);
        this.onDragged = this.onDragged.bind(this);
        this.state = {
            draggingData: null,
            draggingMeta: null,
            onDragStartInterface: this.onDragging,
            onDragEndInterface: this.onDragged,
        }
    }

    public render() {
        return (<context.Provider value={this.state}>{this.props.children}</context.Provider>);
    }

    private onDragging({ data, meta }: { data: DataObject, meta: DataObject }) {
        this.setState({ draggingData: data, draggingMeta: meta });
    }
    private onDragged() {
        this.setState({ draggingData: null, draggingMeta: null });
    }
}

export const withDragAndDropData = <P extends {}>(Inner: React.ComponentType<P & IDraggingProviderRenderProps & { ref?: React.Ref<any> }>): React.ComponentType<P> => (
    React.forwardRef(
        (props, ref) => (
            <context.Consumer>
                {({ draggingData, draggingMeta, onDragEndInterface, onDragStartInterface }) => (
                    <Inner
                        {...props}
                        onDragStartInterface={onDragStartInterface}
                        onDragEndInterface={onDragEndInterface}
                        draggingData={draggingData}
                        draggingMeta={draggingMeta}
                        ref={ref} />
                )}
            </context.Consumer>
        )));
