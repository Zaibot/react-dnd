import { IBounds, DataKey, DataObject, emptyBounds, IPosition, emptyPosition, isBoundsSame } from "../../utils";
import React from "react";
import { withDragAndDropData, IDraggingProviderRenderProps } from "../dragging-provider";

export type DragStartHandler = (args: { position: IPosition, dataMetaOverride?: DataObject }) => void;
export type DragHandler = (args: { position: IPosition }) => void;

export interface IDraggableContext {
    readonly bounds: IBounds;
    readonly dataKey: DataKey;
    readonly dataMetaOverride: DataObject | undefined;
    readonly draggingPosition: IPosition | null,
    readonly isDragging: boolean,
    readonly touchPosition: IPosition,
    getData(): DataObject;
    getMeta(): DataObject;
    reportMeasured(bounds: IBounds): void;
    readonly onDragStart: DragStartHandler;
    readonly onDragEnd: DragHandler;
    readonly onDrag: DragHandler;
}

export interface IDraggableContextProps {
    readonly bounds?: IBounds;
    readonly dataKey: DataKey;
    readonly dataData?: DataObject;
    readonly dataMeta?: DataObject;
    readonly onDataData?: (args: { dataKey: DataKey }) => DataObject;
    readonly onDataMeta?: (args: { dataKey: DataKey }) => DataObject;
    readonly onDragStart?: DragStartHandler;
    readonly onDragEnd?: DragHandler;
    readonly onDrag?: DragHandler;
}

const emptyDraggableContext: IDraggableContext = {
    bounds: emptyBounds,
    dataKey: null,
    dataMetaOverride: null,
    draggingPosition: null,
    isDragging: false,
    touchPosition: emptyPosition,
    getData() { },
    getMeta() { },
    reportMeasured() { },
    onDragStart() { },
    onDragEnd() { },
    onDrag() { },
};
const { Provider, Consumer } = React.createContext(emptyDraggableContext);
export const DraggableConsumer = Consumer;
export const withDraggableConsumer = <P extends {}>(Component: React.ComponentType<P & IDraggableContext>): React.ComponentType<P> => {
    return (props: P) => (
        <Consumer>
            {(consumer) => (<Component {...props} {...consumer} />)}
        </Consumer>
    );
};
export const DraggableContext = withDragAndDropData(
    class DraggableContext extends React.Component<IDraggableContextProps & IDraggingProviderRenderProps, IDraggableContext> {
        public static getDerivedStateFromProps(nextProps: IDraggableContextProps & IDraggingProviderRenderProps, prevState: IDraggableContext) {
            const { dataKey, bounds } = nextProps;
            if (bounds && !isBoundsSame(bounds, prevState.bounds)) {
                return { dataKey, bounds };
            }
            if (dataKey !== prevState.dataKey) {
                return { dataKey };
            }
            return null;
        }
        private mounted = false;

        constructor(props: IDraggableContextProps & IDraggingProviderRenderProps, context?: any) {
            super(props, context);

            this.state = {
                bounds: emptyBounds,
                dataKey: props.dataKey,
                dataMetaOverride: null,
                draggingPosition: null,
                getData: this.onDataData,
                getMeta: this.onDataMeta,
                isDragging: false,
                onDrag: this.onDrag,
                onDragEnd: this.onDragEnd,
                onDragStart: this.onDragStart,
                reportMeasured: this.onMeasured,
                touchPosition: emptyPosition,
            }
        }

        public componentDidMount() {
            this.mounted = true;
            this.setState({ draggingPosition: null, isDragging: false, dataMetaOverride: undefined });
        }

        public componentWillUnmount() {
            this.mounted = false;
            this.setState({ draggingPosition: null, isDragging: false, dataMetaOverride: undefined });
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
            if (this.state.dataMetaOverride !== undefined) {
                return this.state.dataMetaOverride;
            }
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

        private onDrag: DragHandler = (args) => {
            const draggingPosition = args.position;
            if (this.mounted) {
                this.setState({ draggingPosition, isDragging: true }, () => {
                    if (this.props.onDrag) {
                        this.props.onDrag({ position: draggingPosition });
                    }
                });
            }
        }

        private onDragStart: DragStartHandler = (args) => {
            if (isBoundsSame(this.state.bounds, emptyBounds)) {
                const { dataKey, dataMeta } = this.props;
                console.warn(`[@zaibot/react-dnd] missing bounds on draggable`, { dataKey, dataMeta });
            }
            const draggingPosition = args.position;
            const dataMetaOverride = args.dataMetaOverride;
            const touchPosition: IPosition = {
                left: draggingPosition.left - this.state.bounds.left,
                top: draggingPosition.top - this.state.bounds.top,
            };
            if (this.mounted) {
                this.setState({ draggingPosition, touchPosition, isDragging: true, dataMetaOverride }, () => {
                    const data = this.state.getData();
                    const meta = this.state.getMeta();
                    this.props.onDragStartInterface({ data, meta });
                    if (this.props.onDragStart) {
                        this.props.onDragStart({ position: draggingPosition, dataMetaOverride });
                    }
                });
            }
        }

        private onDragEnd: DragHandler = (args) => {
            const draggingPosition = null;
            if (this.mounted) {
                this.setState({ draggingPosition, isDragging: false, dataMetaOverride: undefined }, () => {
                    this.props.onDragEndInterface();
                    if (this.props.onDragEnd) {
                        this.props.onDragEnd({ position: args.position });
                    }
                });
            }
        }
    });
