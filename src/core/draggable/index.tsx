import { IBounds, DataKey, DataObject, emptyBounds, IPosition, emptyPosition, isBoundsSame } from "../../utils";
import React from "react";
import { withDragAndDropData, IDraggingProviderRenderProps } from "../dragging-provider";

export interface IDraggableContext {
    isDragging: boolean,
    draggingPosition: IPosition | null,
    touchPosition: IPosition,
    dataKey: DataKey;
    bounds: IBounds;
    getData(): DataObject;
    getMeta(): DataObject;
    reportMeasured(bounds: IBounds): void;
    onDragStart(arg: { position: IPosition }): void;
    onDragEnd(arg: { position: IPosition }): void;
    onDrag(arg: { position: IPosition }): void;
}
const emptyDraggableContext: IDraggableContext = {
    isDragging: false,
    draggingPosition: null,
    touchPosition: emptyPosition,
    bounds: emptyBounds,
    dataKey: null,
    getData() { },
    getMeta() { },
    reportMeasured() { },
    onDragStart() { },
    onDragEnd() { },
    onDrag() { },
};
const { Provider, Consumer } = React.createContext(emptyDraggableContext);
export interface IDraggableContextProps {
    readonly bounds?: IBounds;
    readonly dataKey: DataKey;
    readonly dataData?: DataObject;
    readonly dataMeta?: DataObject;
    readonly onDataData?: (args: { dataKey: DataKey }) => DataObject;
    readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
    readonly onDragStart?: (arg: { position: IPosition }) => void;
    readonly onDragEnd?: (arg: { position: IPosition }) => void;
    readonly onDrag?: (arg: { position: IPosition }) => void;
}
export const withDraggableConsumer = <P extends {}>(Component: React.ComponentType<P & IDraggableContext>): React.ComponentType<P> => {
    return (props: P) => (
        <Consumer>
            {(consumer) => (<Component {...props} {...consumer} />)}
        </Consumer>
    );
};
export const DraggableContext = withDragAndDropData(
    class DraggableContext extends React.Component<IDraggableContextProps & IDraggingProviderRenderProps, IDraggableContext> {
        public static getDerivedStateFromProps(nextProps: IDraggableContextProps, prevState: IDraggableContext) {
            const { dataKey, bounds } = nextProps;
            if (bounds && !isBoundsSame(bounds, prevState.bounds)) {
                return { dataKey, bounds };
            }
            if (dataKey !== prevState.dataKey) {
                return { dataKey };
            }
            return null;
        }
        constructor(props: IDraggableContextProps & IDraggingProviderRenderProps, context?: any) {
            super(props, context);

            this.state = {
                isDragging: false,
                draggingPosition: null,
                touchPosition: emptyPosition,
                bounds: emptyBounds,
                dataKey: props.dataKey,
                getData: this.onDataData,
                getMeta: this.onDataMeta,
                reportMeasured: this.onMeasured,
                onDrag: this.onDrag,
                onDragStart: this.onDragStart,
                onDragEnd: this.onDragEnd,
            }
        }

        public render() {
            const state = this.state;
            const children = this.props.children;
            return (<Provider value={state}>{children}</Provider>);
        }

        private onDataData = () => {
            if (this.props.onDataData) {
                const dataKey = this.props.dataKey;
                return this.props.onDataData({ dataKey });
            }
            if (this.props.dataData !== undefined) {
                const data = this.props.dataData;
                return data;
            }
            return this.props.dataKey;
        }

        private onDataMeta = () => {
            if (this.props.onDataMeta) {
                const dataKey = this.props.dataKey;
                return this.props.onDataMeta({ dataKey });
            }
            const meta = this.props.dataMeta;
            return meta;
        }

        private onMeasured = (bounds: IBounds) => {
            this.setState(({ bounds: oldBounds }) => {
                if (isBoundsSame(oldBounds, bounds)) {
                    return null;
                }
                return { bounds };
            });
        }

        private onDrag = (args: { position: IPosition }) => {
            const draggingPosition = args.position;
            this.setState({ draggingPosition, isDragging: true }, () => {
                if (this.props.onDrag) {
                    this.props.onDrag({ position: draggingPosition });
                }
            });
        }

        private onDragStart = (args: { position: IPosition }) => {
            if (isBoundsSame(this.state.bounds, emptyBounds)) {
                console.warn(`[@zaibot/react-dnd] missing bounds on draggable`, this.props.dataKey);
            }
            const draggingPosition = args.position;
            const touchPosition: IPosition = {
                left: draggingPosition.left - this.state.bounds.left,
                top: draggingPosition.top - this.state.bounds.top,
            };
            this.setState({ draggingPosition, touchPosition, isDragging: true }, () => {
                const data = this.state.getData();
                const meta = this.state.getMeta();
                this.props.onDragging({ data, meta });
                if (this.props.onDragStart) {
                    this.props.onDragStart({ position: draggingPosition });
                }
            });
        }

        private onDragEnd = (args: { position: IPosition }) => {
            const draggingPosition = null;
            this.setState({ draggingPosition, isDragging: false }, () => {
                const data = this.state.getData();
                const meta = this.state.getMeta();
                this.props.onDragged();
                if (this.props.onDragEnd) {
                    this.props.onDragEnd({ position: args.position });
                }
            });
        }
    });
