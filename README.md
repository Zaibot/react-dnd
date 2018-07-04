![build status](https://travis-ci.org/Zaibot/react-dnd.svg?branch=master)

# @zaibot/react-dnd

[Demo / Documentation](https://zaibot.github.io/react-dnd/)

## Terminology

| Name | Meaning |
| - | - |
| Draggable | Container used for cloned image |
| Dragging | Cloned image |
| Drag Container Props | Positioning props for cloned image |
| Drag Handle Props | Event props for drag handle |
| Drop Props | Event props for dropping container |
| Tracking | Container used for calculating positioning |
| Container | HTML element of/wrapping your content |
| Handle | Specific actionable part within a draggable |
| Key | Information used to identify the information to be dragged |
| Data | The data object to be received during a drop |
| Meta | Additional information related to action of dragging |

## Usage

Required root for information sharing
```js
import { DraggingProvider } from '@zaibot/react-dnd';

ReactDOM.render(
    <DraggingProvider>
        <div>
            ...
        </div>
    </DraggingProvider>
)
```

Drop area
```js
import { Droppable } from '@zaibot/react-dnd';

const DropArea = () => (
    <Droppable onDropped={({ droppingPosition, droppingData }) => { ... }}>
        {({ dropProps, trackingProps }) => (
            <div {...dropProps} {...trackingProps}>
                ...
            </div>
        )}
    </Droppable>
)
```

Draggable
```js
import { Droppable } from '@zaibot/react-dnd';

const DragMe = () => (
    <Draggable dataDrag={`item`}>
        {({ isDragged, dragContainerProps, dragHandleProps, trackingProps, dragging }) => (
            <div {...dragContainerProps} {...dragHandleProps} {...trackingProps}>{dragging}Drag me</div>
        )}
    </Draggable>
)
```

Re-order Area
```js
import { Draggable, Droppable, PositionContainer, PositionPublisher } from '@zaibot/react-dnd';

const DropArea = () => (
    <PositionContainer>
        {({ ref, registries }) => (
            <Droppable refTracking={ref} onDropped={({ droppingPosition, droppingData }) => { ... }}>
                {({ dropProps, trackingProps }) => (
                    <div {...dropProps} {...trackingProps}>
                        ...
                    </div>
                )}
            </Droppable>
        )}
    </PositionContainer>
)

const DragMe = () => (
    <PositionPublisher keyData={`item`}>
        {({ refContainer }) => (
            <Draggable refTracking={refContainer} dataDrag={`item`}>
                {({ isDragged, dragContainerProps, dragHandleProps, trackingProps, dragging }) => (
                    <div {...dragContainerProps} {...dragHandleProps} {...trackingProps}>{dragging}Drag me</div>
                )}
            </Draggable>
        )}
    </PositionPublisher>
)
```

## Resources

https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
