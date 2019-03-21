import React, { useRef, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { DnDLayerContainer } from "../src/hooks/container";
import { useDnD, useDnDTarget } from "../src/hooks/context";
import { DnDContextProvider } from "../src/hooks/root";
import {
  useDnDMouseSourceHandle,
  useDnDMouseTargetContainer
} from "../src/hooks/mouse";
import { DnDSource } from "../src/hooks/source";
import { DnDTarget } from "../src/hooks/target";
import { useDragState } from "../src/hooks/state";
import { DnDInspector } from "../src";
import { DragSession } from "../src/hooks/DragSession";

const stories = storiesOf("react-dnd/Container", module);

const Red = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>();
  const handle = useDnDMouseSourceHandle(ref);
  return (
    <div
      ref={ref}
      {...handle}
      style={{ background: `#fcc`, display: `inline-block`, padding: `2rem` }}
    >
      {props.children}
    </div>
  );
};

const Blue = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>();
  const handle = useDnDMouseSourceHandle(ref);
  return (
    <div
      ref={ref}
      {...handle}
      style={{
        background: `#aaf`,
        display: `inline-block`,
        padding: `2rem`,
        opacity: 3 / 4
      }}
    >
      {props.children}
    </div>
  );
};

const Yellow = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>();
  const handle = useDnDMouseTargetContainer(ref);
  return (
    <div
      ref={ref}
      {...handle}
      style={{ background: `#ffa`, display: `inline-block`, padding: `2rem` }}
    >
      {props.children}
    </div>
  );
};

const Container = (props: { children: React.ReactNode }) => {
  const { session } = useDnDTarget();
  const { dropping, dropped } = useDragState(session);
  useLogActions(session);
  return (
    <Yellow>
      {dropping ? dropping.data : dropped ? dropped.data : props.children}
    </Yellow>
  );
};

stories.add(`Example`, () => (
  <DnDContextProvider>
    <Status />
    <DnDSource data="R: Hello World!">
      <Red>Hello World!</Red>
      <DnDLayerContainer>
        <Red>Hello World!</Red>
      </DnDLayerContainer>
    </DnDSource>
    <DnDSource data="B: Hello World!">
      <Blue>Hello World!</Blue>
      <DnDLayerContainer>
        <Blue>Hello World!</Blue>
      </DnDLayerContainer>
    </DnDSource>
    <hr />
    <DnDTarget meta="A">
      <Container>A</Container>
    </DnDTarget>
    <hr />
    <DnDTarget meta="B">
      <Container>B</Container>
    </DnDTarget>
    <hr />
    <DnDSource data="R: Hello World!">
      <Red>Hello World!</Red>
      <DnDLayerContainer>
        <Red>Hello World!</Red>
      </DnDLayerContainer>
    </DnDSource>
    <DnDSource data="B: Hello World!">
      <Blue>Hello World!</Blue>
      <DnDLayerContainer>
        <Blue>Hello World!</Blue>
      </DnDLayerContainer>
    </DnDSource>
    <hr />
    <DnDInspector />
  </DnDContextProvider>
));

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
