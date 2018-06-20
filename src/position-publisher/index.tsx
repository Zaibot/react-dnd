import React from "react";
import { PositionConsumer } from "../position-context";
import { RefMethod, IBounds, DataKey, emptyBounds, AnyElement, Minus } from "../utils";

export interface IPositionPublisherRenderProps {
    readonly refContainer: RefMethod;
}

export interface IPositionPublisherInternalProps {
    readonly reportRefContainer: (key: DataKey, getBounds: (() => IBounds) | null) => void;
}

export interface IPositionPublisherProps extends IPositionPublisherInternalProps {
    readonly reportRefContainer: (key: DataKey, getBounds: (() => IBounds) | null) => void;
    readonly refContainer?: RefMethod;
    readonly keyData: DataKey;
    readonly children: (props: IPositionPublisherRenderProps) => React.ReactNode;
}

class PositionPublisherImpl extends React.Component<IPositionPublisherProps> {
    private __element: AnyElement;
    constructor(props: IPositionPublisherProps, context?: any) {
        super(props, context);
        // console.log(`Made PositionPublisherImpl`);
        this.onRefContainer = this.onRefContainer.bind(this);
        this.getBounds = this.getBounds.bind(this);
    }
    public render() {
        const { children } = this.props;
        const refContainer = this.onRefContainer;
        return children({ refContainer });
    }
    private onRefContainer(element: AnyElement) {
        if (this.__element !== element) {
            this.__element = element;
            this.props.reportRefContainer(this.props.keyData, element ? this.getBounds : null);
            if (this.props.refContainer) { this.props.refContainer(element); }
        }
    }
    private getBounds(): IBounds {
        // console.log(this.props.keyData.id, this.__element)
        return this.__element ? this.__element.getBoundingClientRect() : emptyBounds;
    }
}

export const PositionPublisher = ({ children, ...props }: Minus<IPositionPublisherProps, IPositionPublisherInternalProps>) => (
    <PositionConsumer >
        {({ reportRefContainer }) => (
            <PositionPublisherImpl {...props} reportRefContainer={reportRefContainer}>{children}</PositionPublisherImpl>
        )}
    </PositionConsumer>
);

type OmitRenderProps<T> = Minus<T, IPositionPublisherRenderProps>;
type OmitChildren<T> = Minus<T, { children?: any }>;

export const withPositionPublisher = <P extends IPositionPublisherRenderProps>(component: React.ComponentType<P>) => {
    type Props = OmitChildren<IPositionPublisherProps> & OmitRenderProps<P>;
    const Component: any = component;
    const Wrapped: React.ComponentType<Props> = React.forwardRef(
        (props, ref) => {
            const { refContainer, reportRefContainer, keyData, ...extraProps } = props as any; /* HACK: https://github.com/Microsoft/TypeScript/issues/12520 */;
            return (
                <PositionPublisher keyData={keyData} refContainer={refContainer}>
                    {(positionProps) => (
                        <Component {...positionProps} {...extraProps} ref={ref} />
                    )}
                </PositionPublisher>
            );
        });
    return Wrapped;
};
