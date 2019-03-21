import React, { useRef, useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import {
  DnDLayerContainer,
  DnDTargetContainer,
  DnDSourceContainer
} from "../src/hooks/container";
import { useDnD, useDnDTarget } from "../src/hooks/context";
import { DnDContextProvider } from "../src/hooks/root";
import { DnDInspector } from "../src/hooks/inspector";
import { DnDSource } from "../src/hooks/source";
import { useDragState } from "../src/hooks/state";
import { DnDTarget } from "../src/hooks/target";
import {
  closestCorner,
  IClosestCornerResult
} from "../src/strategy-closest-corner";
import {
  useMeasureElement,
  useMeasurements,
  MeasurementRoot,
  Bounds
} from "../src/hooks/measure";
import { handleSortByBoundary } from "../src/ordering";
import { DragSession } from "../src/hooks/DragSession";
import { action } from "@storybook/addon-actions";

const stories = storiesOf("react-dnd/Sorting", module);

const Red = (props: { id: string; children: React.ReactNode }) => {
  const el = useRef<HTMLDivElement>(null);
  useMeasureElement()(props.id, el);
  return (
    <div
      style={{
        background: `#fcc`,
        display: `inline-block`,
        padding: `2rem`,
        borderTop: `1px dotted #000`,
        borderBottom: `1px dotted #000`
      }}
      ref={el}
    >
      {props.children}
    </div>
  );
};

const RedLayer = (props: { id: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        background: `#fcc`,
        display: `inline-block`,
        padding: `2rem`,
        borderTop: `1px dotted #000`,
        borderBottom: `1px dotted #000`
      }}
    >
      {props.children}
    </div>
  );
};

const defaultItems = [
  { label: `Item 1` },
  { label: `Item 2` },
  { label: `Item 3` },
  { label: `Item 4` },
  { label: `Item 5` }
];

const Sortable = (props: {
  items: any[];
  onChange: (items: any[]) => void;
}) => {
  return (
    <DnDTarget meta="Sortable">
      <SortableContent {...props} />
    </DnDTarget>
  );
};

const DropIndicator = (props: {
  bounds: Bounds;
  isAfter: boolean;
  isBefore: boolean;
}) => {
  if (props.isBefore) {
    return (
      <div
        style={{
          background: `#000`,
          height: 2,
          position: `absolute`,
          left: 0,
          right: 0,
          top: props.bounds.top
        }}
      />
    );
  }
  if (props.isAfter) {
    return (
      <div
        style={{
          background: `#000`,
          height: 2,
          position: `absolute`,
          left: 0,
          right: 0,
          top: props.bounds.bottom - 2
        }}
      />
    );
  }
};

const SortableContent = (props: {
  items: any[];
  onChange: (items: any[]) => void;
}) => {
  const { bounds } = useMeasurements();
  const { session } = useDnDTarget();
  useLogActions(session);
  const [state, setState] = useState<IClosestCornerResult | null>(null);
  useEffect(() => {
    if (session) {
      setState(null);
      session.on(`free`, () => {
        setState(null);
      });
      session.on(`move`, dragging => {
        if (dragging.interaction) {
          const position = {
            left: dragging.interaction.pageX,
            top: dragging.interaction.pageY
          };
          const elements = Object.entries(bounds).map(([key, bounds]) => ({
            key,
            bounds
          }));
          const closest = closestCorner.vertical(position, elements);
          setState(closest);
        } else {
          setState(null);
        }
      });
      session.on(`release`, dropping => {
        const position = {
          left: dropping.interaction.pageX,
          top: dropping.interaction.pageY
        };
        const items = handleSortByBoundary(
          props.items,
          bounds,
          dropping.data,
          position,
          item => item.label
        );
        props.onChange(items);
      });
    }
  }, [session]);
  return (
    <DnDTargetContainer>
      {state && (
        <DropIndicator
          bounds={state.element.bounds}
          isAfter={state.isAfter}
          isBefore={state.isBefore}
        />
      )}
      {props.items.map(x => (
        <DnDSource key={x.label} data={x.label}>
          <DnDSourceContainer>
            <Red id={x.label}>{x.label}</Red>
          </DnDSourceContainer>
          <DnDLayerContainer>
            <RedLayer id={x.label}>{x.label}</RedLayer>
          </DnDLayerContainer>
        </DnDSource>
      ))}
    </DnDTargetContainer>
  );
};

const Example = () => {
  const [items, setItems] = useState(defaultItems);
  return (
    <MeasurementRoot>
      <DnDContextProvider>
        <Status />
        <Sortable items={items} onChange={setItems} />
        <hr />
        <DnDInspector />
      </DnDContextProvider>
    </MeasurementRoot>
  );
};

stories.add(`Example`, () => <Example />);

const Status = () => {
  const { session } = useDnD();
  const { dragging, dropping } = useDragState(session);
  return (
    <pre style={{ fontSize: `10px` }}>
      Dragging {(dragging && dragging.data) || `-`} onto{" "}
      {(dropping && dropping.meta) || `-`}
    </pre>
  );
};

const useLogActions = (session: DragSession) => {
  useEffect(() => {
    if (session) {
      const abort = action(`drop - abort`);
      const accept = action(`drop - accept`);
      const decline = action(`drop - decline`);
      const free = action(`drop - free`);
      const move = action(`drop - move`);
      const outside = action(`drop - outside`);
      const release = action(`drop - release`);
      session.on(`abort`, abort);
      session.on(`accept`, accept);
      session.on(`decline`, decline);
      session.on(`free`, free);
      session.on(`move`, move);
      session.on(`outside`, outside);
      session.on(`release`, release);
      return () => {
        session.off(`abort`, abort);
        session.off(`accept`, accept);
        session.off(`decline`, decline);
        session.off(`free`, free);
        session.off(`move`, move);
        session.off(`outside`, outside);
        session.off(`release`, release);
      };
    }
  }, [session]);
};
