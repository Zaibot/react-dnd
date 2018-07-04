import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Droppable } from "../src/droppable";
import { DragLayer } from "../src/drag-layer";
import { Measure } from "../src/measure";
import { DragHandle } from "../src/drag-handle";
import { closestCorner } from "../src/strategy-closest-corner";
import { DraggableContext, DraggingProvider } from "../src/core";

const stories = storiesOf("react-dnd/Drag&Drop", module);

const Red = ({ ...props }: React.HTMLProps<HTMLDivElement>) => <div
  {...props}
  style={{ ...props.style, background: `#fcc`, display: `inline-block`, padding: `2rem` }} />;
const Blue = ({ ...props }: React.HTMLProps<HTMLDivElement>) => <div
  {...props}
  style={{ ...props.style, background: `#aaf`, display: `inline-block`, padding: `2rem`, opacity: 3 / 4 }} />;
const Yellow = ({ ...props }: React.HTMLProps<HTMLDivElement>) => <div
  {...props}
  style={{ ...props.style, background: `#ffa`, display: `inline-block`, padding: `2rem` }} />;

const orderingData = [
  { id: 1, text: `Hello` },
  { id: 2, text: `World` },
  { id: 3, text: `!` },
];

stories
  .add(`Basic`, () => (
    <DraggingProvider>
      <Droppable onDrop={action(`onDrop`)} onDragOver={action(`onDragOver`)} onDragOut={action(`onDragOut`)}>
        {({ isDropping, dropProps, trackingProps }) => (
          <Red {...trackingProps} {...dropProps}>
            {isDropping ? "Dropping!" : "Waiting..."}
          </Red>
        )}
      </Droppable>
      <DraggableContext dataKey={1} onDragEnd={action(`onDragEnd`)} onDragStart={action(`onDragStart`)}>
        <DragLayer>
          <Blue>Being dragged</Blue>
        </DragLayer>
        <Measure>
          <DragHandle><Yellow>Dragging me</Yellow></DragHandle>
        </Measure>
      </DraggableContext>
    </DraggingProvider>
  ))
  .add(`Handle`, () => (
    <DraggingProvider>
      <Droppable onDrop={action(`onDrop`)} onDragOver={action(`onDragOver`)} onDragOut={action(`onDragOut`)}>
        {({ isDropping, dropProps, trackingProps }) => (
          <Red {...trackingProps} {...dropProps}>
            {isDropping ? "Dropping!" : "Waiting..."}
          </Red>
        )}
      </Droppable>
      <DraggableContext dataKey={1} onDragEnd={action(`onDragEnd`)} onDragStart={action(`onDragStart`)}>
        <DragLayer>
          <Blue><DragHandle>Handle</DragHandle> Being dragged</Blue>
        </DragLayer>
        <Measure>
          <Yellow><DragHandle>Handle</DragHandle> Dragging me</Yellow>
        </Measure>
        {/* : <Yellow {...dragContainerProps} innerRef={ref}>{dragging}<DragHandle>Handle</DragHandle> Drag me</Yellow> */}
      </DraggableContext>
    </DraggingProvider>
  ))
  .add(`Ordering`, () => (
    <DraggingProvider>
      {/* <PositionContainer>
        {({ refContainer, registries }) => (
          <Droppable onDrop={action(`onDrop`)} onDragOver={action(`onDragOver`)} onDragOut={action(`onDragOut`)} refTracking={refContainer}>
            {({ isDropping, dropProps, trackingProps, droppingPosition }) => (
              <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>
                {orderingData.map((item) => (
                  <PositionPublisher keyData={item}>
                    {({ refContainer }) => (
                      <Draggable dataKey={item} onDragEnd={action(`onDragEnd`)} onDragMove={undefined} onDragStart={action(`onDragStart`)} refTracking={refContainer}>
                        {({ isDragged, dragContainerProps, dragHandleProps, trackingProps, dragging }) => (
                          isDragged
                            ? <Blue {...dragContainerProps} {...dragHandleProps} innerRef={trackingProps.ref}>{dragging}{item.text}</Blue>
                            : <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={trackingProps.ref}>{dragging}{item.text}</Yellow>
                        )}
                      </Draggable>
                    )}
                  </PositionPublisher>
                ))}

                <ol>
                  {registries.map(({ getBounds, key }) => (
                    <li>{key.text} ({getBounds().left}:{getBounds().top}, {getBounds().width}w{getBounds().height}h)</li>
                  ))}
                </ol>
                <p style={{ whiteSpace: 'pre' }}>
                  {isDropping
                    ? <span>Dropping: {(() => {
                      const elements = registries.map(({ getBounds, key }) => ({ bounds: getBounds(), key, order: orderingData.indexOf(key) }));
                      const closest = closestCorner.horizontal(droppingPosition, elements);
                      return (
                        <span>{closest.isBefore ? 'Before' : 'After'} {closest.element.key.text}</span>
                      );
                    })()}</span>
                    : `Drag something`}
                </p>
              </Red>
            )}
          </Droppable>
        )}
      </PositionContainer> */}
    </DraggingProvider>
  ));
