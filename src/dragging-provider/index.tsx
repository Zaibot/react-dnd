import * as React from "react";
import { DataObject, Omit } from "../utils";

export interface IDraggingInterface {
    readonly draggingData: DataObject;
    readonly onDragging: (data: DataObject) => void;
    readonly onDragged: () => void;
}

const context = React.createContext<IDraggingInterface>({
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

    private onDragging(draggingData: any) {
        // console.log(`DraggingProvider.setState: onDragging`, data);
        this.setState({ draggingData });
    }
    private onDragged() {
        // console.log(`DraggingProvider.setState: onDragged`);
        this.setState({ draggingData: null });
    }
}

export interface IDraggingConsumer {
    draggingData: DataObject;
    onDragging: (data: DataObject) => void;
    onDragged: () => void;
}

export const withDragAndDropData =
    <T extends IDraggingConsumer>
        (Inner: React.ReactType<T>): React.ComponentType<Omit<T, keyof IDraggingConsumer>> => {
        return React.forwardRef((props, ref) => (
            <context.Consumer>
                {({ draggingData, onDragged, onDragging }) => (
                    <Inner {...props} onDragging={onDragging} onDragged={onDragged} draggingData={draggingData} ref={ref} />
                )}
            </context.Consumer>
        ));
    };
