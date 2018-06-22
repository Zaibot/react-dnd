import * as React from "react";
import { DataObject, Minus } from "../utils";

export interface IDraggingInterface {
    readonly draggingData: DataObject;
    readonly draggingMeta: DataObject;
    readonly onDragging: (data: DataObject) => void;
    readonly onDragged: () => void;
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
        return (
            <context.Provider value={this.state}>
                {this.props.children}
            </context.Provider>
        );
    }

    private onDragging({ data, meta }: { data: DataObject, meta: DataObject }) {
        // console.log(`DraggingProvider.setState: onDragging`, data);
        this.setState({ draggingData: data, draggingMeta: meta });
    }
    private onDragged() {
        // console.log(`DraggingProvider.setState: onDragged`);
        this.setState({ draggingData: null });
    }
}

export interface IDraggingConsumer {
    draggingData: DataObject;
    draggingMeta: DataObject;
    onDragging: (args: { data: DataObject, meta: DataObject }) => void;
    onDragged: () => void;
}

type OmitRenderProps<P> = Minus<P, IDraggingConsumer>;

export const withDragAndDropData = <P extends IDraggingConsumer>(Inner: React.ReactType<P>) => {
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
