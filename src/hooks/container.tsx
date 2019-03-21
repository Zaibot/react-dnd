import React, {
  useRef,
  CSSProperties,
  useMemo,
  useState,
  useEffect
} from "react";
import { useDnDMouseSourceHandle, useDnDMouseTargetContainer } from "./mouse";
import { calcLayerOffsetToClient } from "./overlay";
import { useDnDSource, DragInfo } from "./context";

export const DnDSourceContainer = ({
  component: Component = `div` as any,
  children
}: {
  component?: React.ComponentType<{ ref?: React.RefObject<any> }>;
  children: React.ReactNode;
}) => {
  const ref = useRef<Element>();
  const handle = useDnDMouseSourceHandle(ref);
  return (
    <Component {...handle} ref={ref}>
      {children}
    </Component>
  );
};

export const DnDTargetContainer = ({
  component: Component = `div` as any,
  children
}: {
  component?: React.ComponentType<{ ref?: React.RefObject<any> }>;
  children: React.ReactNode;
}) => {
  const ref = useRef<Element>();
  const handle = useDnDMouseTargetContainer(ref);
  return (
    <Component {...handle} ref={ref}>
      {children}
    </Component>
  );
};

export const DnDLayerContainer = ({
  component: Component = `div` as any,
  children
}: {
  component?: React.ComponentType<{ style: CSSProperties }>;
  children: React.ReactNode;
}) => {
  const { session } = useDnDSource();
  const [dragging, setDragging] = useState<DragInfo | null>(null);

  useEffect(() => {
    if (session) {
      const move = ({ data, interaction }: any) => {
        setDragging({
          data: data,
          current: interaction,
          origin: session.origin
        });
      };
      session.on(`move`, move);
      return () => {
        session.off(`move`, move);
        setDragging(null);
      };
    }
  }, [session]);

  const style = useMemo<CSSProperties | null>(() => {
    if (!dragging) {
      return null;
    }
    const position = calcLayerOffsetToClient(
      dragging.origin,
      dragging.current
    )!;
    return {
      position: `fixed`,
      left: 0,
      top: 0,
      transform: `translate(${position.clientX}px, ${position.clientY}px)`,
      pointerEvents: `none`
    };
  }, [dragging]);
  return style && <Component style={style}>{children}</Component>;
};
