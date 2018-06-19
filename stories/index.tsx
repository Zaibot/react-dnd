import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Droppable } from "../src/droppable";
import { DraggingProvider } from "../src/dragging-provider";
import { Draggable } from "../src/draggable";
import { DragHandle } from "../src/drag-handle";
import { PositionContainer } from "../src/position-container";
import { PositionPublisher } from "../src/position-publisher";
import { closestCorner } from "../src/strategy-closest-corner";

const stories = storiesOf("react-dnd", module);

const Red = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => <div
  {...props}
  ref={innerRef}
  style={{ ...props.style, background: `#fcc`, display: `inline-block`, padding: `2rem` }} />;
const Blue = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => <div
  {...props}
  ref={innerRef}
  style={{ ...props.style, background: `#aaf`, display: `inline-block`, padding: `2rem`, opacity: 3 / 4 }} />;
const Yellow = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => <div
  {...props}
  ref={innerRef}
  style={{ ...props.style, background: `#ffa`, display: `inline-block`, padding: `2rem` }} />;

const orderingData = [
  { id: 1, text: `Hello` },
  { id: 2, text: `World` },
  { id: 3, text: `!` },
];

stories
  .add(`Basic`, () => (
    <DraggingProvider>
      <Droppable onDropped={action(`onDropped`)} onDropping={undefined}>
        {({ isDropping, dropProps, trackingProps }) => (
          <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>
            {isDropping ? "Dropping!" : "Waiting..."}
          </Red>
        )}
      </Droppable>
      <Draggable dataDrag={1} onDragEnd={action(`onDragEnd`)} onDragMove={undefined} onDragStart={action(`onDragStart`)}>
        {({ isDragging, isDragged, dragContainerProps, dragHandleProps, trackingProps: { ref }, dragging }) => (
          isDragged
            ? <Blue {...dragContainerProps} {...dragHandleProps} innerRef={ref}>Being dragged</Blue>
            : isDragging
              ? <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={ref}>{dragging}Dragging me</Yellow>
              : <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={ref}>{dragging}Drag me</Yellow>

        )}
      </Draggable>
    </DraggingProvider>
  ))
  .add(`Handle`, () => (
    <DraggingProvider>
      <Droppable onDropped={action(`onDropped`)} onDropping={undefined}>
        {({ isDropping, dropProps, trackingProps }) => (
          <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>
            {isDropping ? "Dropping!" : "Waiting..."}
          </Red>
        )}
      </Droppable>
      <Draggable dataDrag={1} onDragEnd={action(`onDragEnd`)} onDragMove={undefined} onDragStart={action(`onDragStart`)}>
        {({ isDragging, isDragged, dragContainerProps, dragHandleProps, trackingProps: { ref }, dragging }) => (
          isDragged
            ? <Blue {...dragContainerProps} innerRef={ref}><DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Being dragged</Blue>
            : isDragging
              ? <Yellow {...dragContainerProps} innerRef={ref}>{dragging}<DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Dragging me</Yellow>
              : <Yellow {...dragContainerProps} innerRef={ref}>{dragging}<DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Drag me</Yellow>
        )}
      </Draggable>
    </DraggingProvider>
  ))
  .add(`Ordering`, () => (
    <DraggingProvider>
      <PositionContainer>
        {({ refContainer, registries }) => (
          <Droppable onDropped={action(`onDropped`)} onDropping={undefined} refTracking={refContainer}>
            {({ isDropping, dropProps, trackingProps, droppingPosition }) => (
              <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>
                {orderingData.map((item) => (
                  <PositionPublisher keyData={item}>
                    {({ refContainer }) => (
                      <Draggable dataDrag={item} onDragEnd={action(`onDragEnd`)} onDragMove={undefined} onDragStart={action(`onDragStart`)} refTracking={refContainer}>
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
      </PositionContainer>
    </DraggingProvider>
  ));
