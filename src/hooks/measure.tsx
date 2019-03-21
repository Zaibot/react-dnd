import { useState, useCallback, useContext, useRef, useEffect } from "react";
import React from "react";
import warning from "warning";

//
// Measurements
export interface Measurements {
    readonly bounds: { readonly [key: string]: Bounds };
    readonly measured: (key: string, rect: Bounds) => void;
    readonly removed: (key: string) => void;
}

export const emptyMeasurements: Measurements = {
    bounds: {},
    measured: () => warning(false, `[@zaibot/react-dnd] can't register measurement, measurements root is missing`),
    removed: () => warning(false, `[@zaibot/react-dnd] can't unregister measurement, measurements root is missing`),
};

export const createMeasurementsContext = () => React.createContext(emptyMeasurements);
export const GlobalMeasurementsContext = createMeasurementsContext();

export const MeasurementRoot = ({ context: { Provider } = GlobalMeasurementsContext, children }: { context?: React.Context<Measurements>, children: React.ReactNode }) => {
    const data = useDictionary();
    const measured = useCallback((key: string, rect: ClientRect) => data.set({ key, value: cloneBounds(rect) }), [data.set]);
    const removed = useCallback((key: string) => data.remove({ key }), [data.remove]);
    const context: Measurements = { bounds: data.value, measured, removed, };
    return (
        <Provider value={context}>
            {children}
        </Provider>
    );
};

export const withMeasurementRoot = (context: React.Context<Measurements> = GlobalMeasurementsContext) =>
    <P extends {}>(ComponentType: React.ComponentType<P>) =>
        (props: P) => (<MeasurementRoot context={context}><ComponentType {...props} /></MeasurementRoot>);

export const useMeasurements = (context: React.Context<Measurements> = GlobalMeasurementsContext) => {
    return useContext(context);
};

//
// Measurement Element
export const useMeasureElement = (context: React.Context<Measurements> = GlobalMeasurementsContext) => (key: string, element: React.RefObject<HTMLElement | undefined | null>) => {
    const m = useMeasurements(context);
    const { current } = useRef<{ bounds: Bounds | null }>({ bounds: null });
    useEffect(() => {
        const bounds = element.current && cloneBounds(element.current.getBoundingClientRect());
        if (bounds) {
            if (!current.bounds || !isSameBounds(current.bounds, bounds)) {
                current.bounds = bounds;
                m.measured(key, bounds);
            }
        }
    });
    useEffect(() => {
        return () => {
            if (current.bounds) {
                current.bounds = null;
                m.removed(key);
            }
        };
    }, []);
    return current.bounds;
};

//
// Bounds
export interface Bounds {
    readonly top: number;
    readonly left: number;
    readonly right: number;
    readonly bottom: number;
    readonly width: number;
    readonly height: number;
}

export const emptyBounds2 = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
};

export const isSameBounds = (a: Bounds, b: Bounds): boolean => (
    a.top === b.top
    && a.left === b.left
    && a.right === b.right
    && a.bottom === b.bottom
    && a.width === b.width
    && a.height === b.height
);

const cloneBounds = ({ top, left, right, bottom, width, height }: ClientRect): Bounds => ({ top, left, right, bottom, width, height });

//
// Dictionary
const useDictionary = <TValue extends any>() => {
    const [value, setValue] = useState<any>({});
    const set = useCallback((a: { key: string, value: TValue }) => {
        setValue((value: any) => ({ ...value, [a.key]: a.value }));
    }, [setValue]);
    const remove = useCallback((a: { key: string }) => {
        setValue(({ [a.key]: _removed, ...rest }: any) => rest);
    }, [setValue]);
    return { value, set, remove };
};
