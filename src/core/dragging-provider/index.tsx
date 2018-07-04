import * as React from "react";
import { DataObject } from "../../utils";
import { Minus } from "../../internal";

export interface IDraggingInterface {
    draggingData: DataObject;
    draggingMeta: DataObject;
    onDragging: (args: { data: DataObject, meta: DataObject }) => void;
    onDragged: () => void;
}

const context = React.createContext<IDraggingInterface>({
    draggingMeta: null,
    draggingData: null,
    onDragging() {
        console.warn(`[@zaibot/react-dnd] missing DraggingProvider`);
    },
    onDragged() {
        console.warn(`[@zaibot/react-dnd] missing DraggingProvider`);
    },
});

export interface IDraggingProviderRenderProps {
    draggingData: DataObject;
    draggingMeta: DataObject;
    onDragging: (args: { data: DataObject, meta: DataObject }) => void;
    onDragged: () => void;
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
            onDragging: this.onDragging,
            onDragged: this.onDragged,
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

type OmitRenderProps<P> = Minus<P, IDraggingProviderRenderProps>;

export const withDragAndDropData = <P extends IDraggingProviderRenderProps>(Inner: React.ReactType<P>) => {
    const Wrapped: React.ComponentType<OmitRenderProps<P>> = React.forwardRef(
        (props, ref) => (
            <context.Consumer>
                {({ draggingData, draggingMeta, onDragged, onDragging }) => (
                    <Inner
                        {...props}
                        onDragging={onDragging}
                        onDragged={onDragged}
                        draggingData={draggingData}
                        draggingMeta={draggingMeta}
                        ref={ref} />
                )}
            </context.Consumer>
        ));
    return Wrapped;
};
