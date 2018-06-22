(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{1117:function(n,t,e){"use strict";e.r(t),function(n){var t=e(0),r=e.n(t),i=e(218),o=e(32),a=e(221),s=e(91),g=e(220),d=e(219),p=e(571),l=e(570),c=e(567),f=e(136).withStorySource;const u=({innerRef:n,...t})=>r.a.createElement("div",Object.assign({},t,{ref:n,style:{...t.style,background:"#fcc",display:"inline-block",padding:"2rem"}})),D=({innerRef:n,...t})=>r.a.createElement("div",Object.assign({},t,{ref:n,style:{...t.style,background:"#aaf",display:"inline-block",padding:"2rem",opacity:.75}})),h=({innerRef:n,...t})=>r.a.createElement("div",Object.assign({},t,{ref:n,style:{...t.style,background:"#ffa",display:"inline-block",padding:"2rem"}})),m=[{id:1,text:"Hello"},{id:2,text:"World"},{id:3,text:"!"}];Object(i.storiesOf)("react-dnd",n).addDecorator(f("import React from 'react';\nimport { storiesOf } from '@storybook/react';\nimport { action } from '@storybook/addon-actions';\nimport { Droppable } from '../src/droppable';\nimport { DraggingProvider } from '../src/dragging-provider';\nimport { Draggable } from '../src/draggable';\nimport { DragHandle } from '../src/drag-handle';\nimport { PositionContainer } from '../src/position-container';\nimport { PositionPublisher } from '../src/position-publisher';\nimport { closestCorner } from '../src/strategy-closest-corner';\n\nconst stories = storiesOf('react-dnd', module);\n\nconst Red = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => (\n  <div\n    {...props}\n    ref={innerRef}\n    style={{ ...props.style, background: `#fcc`, display: `inline-block`, padding: `2rem` }}\n  />\n);\nconst Blue = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => (\n  <div\n    {...props}\n    ref={innerRef}\n    style={{ ...props.style, background: `#aaf`, display: `inline-block`, padding: `2rem`, opacity: 3 / 4 }}\n  />\n);\nconst Yellow = ({ innerRef, ...props }: React.HTMLProps<HTMLDivElement> & { innerRef: any }) => (\n  <div\n    {...props}\n    ref={innerRef}\n    style={{ ...props.style, background: `#ffa`, display: `inline-block`, padding: `2rem` }}\n  />\n);\n\nconst orderingData = [{ id: 1, text: `Hello` }, { id: 2, text: `World` }, { id: 3, text: `!` }];\n\nstories\n  .add(`Basic`, () => (\n    <DraggingProvider>\n      <Droppable onDropped={action(`onDropped`)} onDropping={undefined}>\n        {({ isDropping, dropProps, trackingProps }) => (\n          <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>\n            {isDropping ? 'Dropping!' : 'Waiting...'}\n          </Red>\n        )}\n      </Droppable>\n      <Draggable\n        dataDrag={1}\n        onDragEnd={action(`onDragEnd`)}\n        onDragMove={undefined}\n        onDragStart={action(`onDragStart`)}\n      >\n        {({ isDragging, isDragged, dragContainerProps, dragHandleProps, trackingProps: { ref }, dragging }) =>\n          isDragged ? (\n            <Blue {...dragContainerProps} {...dragHandleProps} innerRef={ref}>\n              Being dragged\n            </Blue>\n          ) : isDragging ? (\n            <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={ref}>\n              {dragging}Dragging me\n            </Yellow>\n          ) : (\n            <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={ref}>\n              {dragging}Drag me\n            </Yellow>\n          )\n        }\n      </Draggable>\n    </DraggingProvider>\n  ))\n  .add(`Handle`, () => (\n    <DraggingProvider>\n      <Droppable onDropped={action(`onDropped`)} onDropping={undefined}>\n        {({ isDropping, dropProps, trackingProps }) => (\n          <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>\n            {isDropping ? 'Dropping!' : 'Waiting...'}\n          </Red>\n        )}\n      </Droppable>\n      <Draggable\n        dataDrag={1}\n        onDragEnd={action(`onDragEnd`)}\n        onDragMove={undefined}\n        onDragStart={action(`onDragStart`)}\n      >\n        {({ isDragging, isDragged, dragContainerProps, dragHandleProps, trackingProps: { ref }, dragging }) =>\n          isDragged ? (\n            <Blue {...dragContainerProps} innerRef={ref}>\n              <DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Being dragged\n            </Blue>\n          ) : isDragging ? (\n            <Yellow {...dragContainerProps} innerRef={ref}>\n              {dragging}\n              <DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Dragging me\n            </Yellow>\n          ) : (\n            <Yellow {...dragContainerProps} innerRef={ref}>\n              {dragging}\n              <DragHandle dragHandleProps={dragHandleProps}>Handle</DragHandle> Drag me\n            </Yellow>\n          )\n        }\n      </Draggable>\n    </DraggingProvider>\n  ))\n  .add(`Ordering`, () => (\n    <DraggingProvider>\n      <PositionContainer>\n        {({ refContainer, registries }) => (\n          <Droppable onDropped={action(`onDropped`)} onDropping={undefined} refTracking={refContainer}>\n            {({ isDropping, dropProps, trackingProps, droppingPosition }) => (\n              <Red {...trackingProps} {...dropProps} innerRef={trackingProps.ref}>\n                {orderingData.map(item => (\n                  <PositionPublisher keyData={item}>\n                    {({ refContainer }) => (\n                      <Draggable\n                        dataDrag={item}\n                        onDragEnd={action(`onDragEnd`)}\n                        onDragMove={undefined}\n                        onDragStart={action(`onDragStart`)}\n                        refTracking={refContainer}\n                      >\n                        {({ isDragged, dragContainerProps, dragHandleProps, trackingProps, dragging }) =>\n                          isDragged ? (\n                            <Blue {...dragContainerProps} {...dragHandleProps} innerRef={trackingProps.ref}>\n                              {dragging}\n                              {item.text}\n                            </Blue>\n                          ) : (\n                            <Yellow {...dragContainerProps} {...dragHandleProps} innerRef={trackingProps.ref}>\n                              {dragging}\n                              {item.text}\n                            </Yellow>\n                          )\n                        }\n                      </Draggable>\n                    )}\n                  </PositionPublisher>\n                ))}\n\n                <ol>\n                  {registries.map(({ getBounds, key }) => (\n                    <li>\n                      {key.text} ({getBounds().left}:{getBounds().top}, {getBounds().width}w{getBounds().height}h)\n                    </li>\n                  ))}\n                </ol>\n                <p style={{ whiteSpace: 'pre' }}>\n                  {isDropping ? (\n                    <span>\n                      Dropping:{' '}\n                      {(() => {\n                        const elements = registries.map(({ getBounds, key }) => ({\n                          bounds: getBounds(),\n                          key,\n                          order: orderingData.indexOf(key),\n                        }));\n                        const closest = closestCorner.horizontal(droppingPosition, elements);\n                        return (\n                          <span>\n                            {closest.isBefore ? 'Before' : 'After'} {closest.element.key.text}\n                          </span>\n                        );\n                      })()}\n                    </span>\n                  ) : (\n                    `Drag something`\n                  )}\n                </p>\n              </Red>\n            )}\n          </Droppable>\n        )}\n      </PositionContainer>\n    </DraggingProvider>\n  ));\n",{})).add("Basic",()=>r.a.createElement(s.a,null,r.a.createElement(a.a,{onDropped:Object(o.action)("onDropped"),onDropping:void 0},({isDropping:n,dropProps:t,trackingProps:e})=>r.a.createElement(u,Object.assign({},e,t,{innerRef:e.ref}),n?"Dropping!":"Waiting...")),r.a.createElement(g.a,{dataDrag:1,onDragEnd:Object(o.action)("onDragEnd"),onDragMove:void 0,onDragStart:Object(o.action)("onDragStart")},({isDragging:n,isDragged:t,dragContainerProps:e,dragHandleProps:i,trackingProps:{ref:o},dragging:a})=>t?r.a.createElement(D,Object.assign({},e,i,{innerRef:o}),"Being dragged"):n?r.a.createElement(h,Object.assign({},e,i,{innerRef:o}),a,"Dragging me"):r.a.createElement(h,Object.assign({},e,i,{innerRef:o}),a,"Drag me")))).add("Handle",()=>r.a.createElement(s.a,null,r.a.createElement(a.a,{onDropped:Object(o.action)("onDropped"),onDropping:void 0},({isDropping:n,dropProps:t,trackingProps:e})=>r.a.createElement(u,Object.assign({},e,t,{innerRef:e.ref}),n?"Dropping!":"Waiting...")),r.a.createElement(g.a,{dataDrag:1,onDragEnd:Object(o.action)("onDragEnd"),onDragMove:void 0,onDragStart:Object(o.action)("onDragStart")},({isDragging:n,isDragged:t,dragContainerProps:e,dragHandleProps:i,trackingProps:{ref:o},dragging:a})=>t?r.a.createElement(D,Object.assign({},e,{innerRef:o}),r.a.createElement(d.a,{dragHandleProps:i},"Handle")," Being dragged"):n?r.a.createElement(h,Object.assign({},e,{innerRef:o}),a,r.a.createElement(d.a,{dragHandleProps:i},"Handle")," Dragging me"):r.a.createElement(h,Object.assign({},e,{innerRef:o}),a,r.a.createElement(d.a,{dragHandleProps:i},"Handle")," Drag me")))).add("Ordering",()=>r.a.createElement(s.a,null,r.a.createElement(p.a,null,({refContainer:n,registries:t})=>r.a.createElement(a.a,{onDropped:Object(o.action)("onDropped"),onDropping:void 0,refTracking:n},({isDropping:n,dropProps:e,trackingProps:i,droppingPosition:a})=>r.a.createElement(u,Object.assign({},i,e,{innerRef:i.ref}),m.map(n=>r.a.createElement(l.a,{keyData:n},({refContainer:t})=>r.a.createElement(g.a,{dataDrag:n,onDragEnd:Object(o.action)("onDragEnd"),onDragMove:void 0,onDragStart:Object(o.action)("onDragStart"),refTracking:t},({isDragged:t,dragContainerProps:e,dragHandleProps:i,trackingProps:o,dragging:a})=>t?r.a.createElement(D,Object.assign({},e,i,{innerRef:o.ref}),a,n.text):r.a.createElement(h,Object.assign({},e,i,{innerRef:o.ref}),a,n.text)))),r.a.createElement("ol",null,t.map(({getBounds:n,key:t})=>r.a.createElement("li",null,t.text," (",n().left,":",n().top,", ",n().width,"w",n().height,"h)"))),r.a.createElement("p",{style:{whiteSpace:"pre"}},n?r.a.createElement("span",null,"Dropping: ",(()=>{const n=t.map(({getBounds:n,key:t})=>({bounds:n(),key:t,order:m.indexOf(t)})),e=c.a.horizontal(a,n);return r.a.createElement("span",null,e.isBefore?"Before":"After"," ",e.element.key.text)})()):"Drag something"))))))}.call(this,e(388)(n))},1118:function(n,t,e){var r={"./index.tsx":1117};function i(n){var t=o(n);return e(t)}function o(n){var t=r[n];if(!(t+1)){var e=new Error("Cannot find module '"+n+"'");throw e.code="MODULE_NOT_FOUND",e}return t}i.keys=function(){return Object.keys(r)},i.resolve=o,n.exports=i,i.id=1118},1137:function(n,t,e){"use strict";e.r(t),function(n){var t=e(218),r=e(1118);Object(t.configure)(function(){r.keys().forEach(function(n){return r(n)})},n)}.call(this,e(388)(n))},1139:function(n,t,e){e(486),e(1138),n.exports=e(1137)},140:function(n,t,e){"use strict";var r=e(560);e.o(r,"emptyBounds")&&e.d(t,"emptyBounds",function(){return r.emptyBounds}),e.o(r,"isPositionSame")&&e.d(t,"isPositionSame",function(){return r.isPositionSame});var i=e(559);e.o(i,"emptyBounds")&&e.d(t,"emptyBounds",function(){return i.emptyBounds}),e.o(i,"isPositionSame")&&e.d(t,"isPositionSame",function(){return i.isPositionSame});var o=e(558);e.d(t,"emptyBounds",function(){return o.a});var a=e(557);e.d(t,"isPositionSame",function(){return a.a});e(556)},217:function(n,t,e){"use strict";e.d(t,"a",function(){return i}),e.d(t,"b",function(){return o});var r=e(0);const{Consumer:i,Provider:o}=r.createContext({reportRefContainer(){console.warn("[@zaibot/react-dnd] missing PositionContainer")},getPosition:()=>(console.warn("[@zaibot/react-dnd] missing PositionContainer"),null),getPositions:()=>(console.warn("[@zaibot/react-dnd] missing PositionContainer"),[])})},219:function(n,t,e){"use strict";e.d(t,"a",function(){return o});var r=e(0),i=e.n(r);class o extends i.a.Component{render(){const{dragHandleProps:n,children:t}=this.props;return i.a.createElement("div",Object.assign({style:{display:"inline"}},n),t)}}},220:function(n,t,e){"use strict";(function(n){e.d(t,"a",function(){return g});var r=e(0),i=e.n(r),o=e(91),a=e(140);let s;const g=Object(o.b)(class extends i.a.Component{constructor(n,t){super(n,t),this.state={isDragging:!1,element:null,offsetWithinElement:null,offsetWithinViewport:null},this.getBounds=this.getBounds.bind(this),this.onRefTracking=this.onRefTracking.bind(this),this.onDragStart=this.onDragStart.bind(this),this.onDrag=this.onDrag.bind(this),this.onDragEnd=this.onDragEnd.bind(this)}render(){return this.renderStatic()}renderStatic(){const{isDragging:n}=this.state,t=this.getBounds(),e=this.state.offsetWithinElement,r={draggable:!0,onDragStart:this.onDragStart,onDrag:this.onDrag,onDragEnd:this.onDragEnd},i={ref:this.onRefTracking},o=n?this.renderDragging():null;return this.props.children({dragHandleProps:r,dragContainerProps:{},trackingProps:i,isDragging:n,isDragged:!1,dragging:o,bounds:t,touchPosition:e})}renderDragging(){const{offsetWithinViewport:n}=this.state,t=this.getBounds();if(!t)return void console.warn("[@zaibot/react-dnd] missing static bounds");if(!n)return void console.warn("[@zaibot/react-dnd] missing dragging offsets");const e=this.state.offsetWithinElement,r={style:{pointerEvents:"none",transform:`translate(${n.left}px, ${n.top}px)`,position:"fixed",boxSizing:"border-box",top:"0",left:"0",width:`${t.width}px`,height:`${t.height}px`,zIndex:999999}};return this.props.children({dragHandleProps:{},dragContainerProps:r,trackingProps:{},isDragging:!0,isDragged:!0,dragging:null,bounds:t,touchPosition:e})}onRefTracking(n){this.state.element!==n&&(this.setState({element:n}),this.props.refTracking&&this.props.refTracking(n))}getBounds(){return this.state.element?this.state.element.getBoundingClientRect():null}onDragStart(t){const e=this.getBounds();if(!e)return void console.warn("[@zaibot/react-dnd] missing static bounds");const r=this.props.onDragData?this.props.onDragData({dataDrag:this.props.dataDrag,dataKey:this.props.dataKey}):this.props.dataDrag,i=this.props.onDragMeta?this.props.onDragMeta({dataDrag:r,dataKey:this.props.dataKey}):this.props.dataMeta;t.dataTransfer.setDragImage((s||((s=new Image).src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),s),0,0),t.dataTransfer.effectAllowed="move",t.stopPropagation();const o={left:t.clientX-e.left,top:t.clientY-e.top},a={left:t.clientX-o.left,top:t.clientY-o.top};n(()=>{this.setState({isDragging:!0,offsetWithinElement:o,offsetWithinViewport:a}),this.props.onDragging({meta:i,data:r})})}onDrag(n){const{offsetWithinElement:t}=this.state;if(!t)return;const e={left:n.clientX-this.state.offsetWithinElement.left,top:n.clientY-this.state.offsetWithinElement.top};Object(a.isPositionSame)(e,this.state.offsetWithinViewport)||this.setState({offsetWithinViewport:e}),n.stopPropagation()}onDragEnd(n){this.setState({isDragging:!1}),this.props.onDragged(),n.stopPropagation()}})}).call(this,e(1116).setImmediate)},221:function(n,t,e){"use strict";e.d(t,"a",function(){return a});var r=e(0),i=e(91),o=e(140);const a=Object(i.b)(class extends r.Component{constructor(n,t){super(n,t),this.state={droppingData:null,droppingMeta:null,droppingPosition:null},this.dropProps={onDrop:this.onDrop.bind(this),onDragOver:this.onDragOver.bind(this),onDragLeave:this.onDragLeave.bind(this)}}render(){const{droppingData:n,droppingPosition:t,droppingMeta:e}=this.state,r=!!this.state.droppingData,i=this.dropProps,o={ref:this.props.refTracking};return this.props.children({dropProps:i,trackingProps:o,isDropping:r,droppingData:n,droppingPosition:t,droppingMeta:e})}onDragOver(n){n.preventDefault();const t=this.props.draggingData,e=this.props.draggingMeta,r={left:n.clientX,top:n.clientY};(this.state.droppingData!==t||this.state.droppingMeta!==e||!Object(o.isPositionSame)(this.state.droppingPosition,r))&&(this.state.droppingData?this.emitDragMove({droppingPosition:r,droppingData:t,droppingMeta:e}):this.emitDragOver({droppingPosition:r,droppingData:t,droppingMeta:e}),this.setState({droppingData:t,droppingPosition:r,droppingMeta:e}))}emitDragOver(n){this.props.onDragOver&&this.props.onDragOver(n)}emitDragOut(n){this.props.onDragOut&&this.props.onDragOut(n)}emitDragMove(n){this.props.onDragMove&&this.props.onDragMove(n)}emitDrop(n){this.props.onDrop&&this.props.onDrop(n)}onDragLeave(n){n.preventDefault();const t=this.state.droppingData,e=this.state.droppingMeta,r=this.state.droppingPosition;this.emitDragOut({droppingPosition:r,droppingData:t,droppingMeta:e}),this.setState({droppingData:null,droppingPosition:null})}onDrop(n){n.preventDefault();const t=this.props.draggingData,e=this.props.draggingMeta,r={left:n.clientX,top:n.clientY};this.emitDrop({droppingPosition:r,droppingData:t,droppingMeta:e}),this.setState({droppingData:null,droppingPosition:null})}})},556:function(n,t){},557:function(n,t,e){"use strict";e.d(t,"a",function(){return r});const r=(n,t)=>n===t||n&&t&&n.left===t.left&&n.top===t.top},558:function(n,t,e){"use strict";e.d(t,"a",function(){return r});const r={left:0,top:0,right:0,bottom:0,width:0,height:0}},559:function(n,t){},560:function(n,t){},567:function(n,t,e){"use strict";const r=(n,t,e,r,i,o)=>{const a=i-e,s=o-r,g=a*a+s*s,d=0!==g?((n-e)*a+(t-r)*s)/g:-1;let p=0,l=0;d<0?(p=e,l=r):d>1?(p=i,l=o):(p=e+d*a,l=r+d*s);const c=n-p,f=t-l;return Math.sqrt(c*c+f*f)};var i;!function(n){n[n.TopLeft=17]="TopLeft",n[n.Top=16]="Top",n[n.TopRight=18]="TopRight",n[n.MiddleLeft=33]="MiddleLeft",n[n.Middle=32]="Middle",n[n.MiddleRight=34]="MiddleRight",n[n.BottomLeft=65]="BottomLeft",n[n.Bottom=64]="Bottom",n[n.BottomRight=66]="BottomRight"}(i||(i={}));e.d(t,"a",function(){return o});const o={vertical:(n,t)=>{const e=t.reduce((t,e)=>{const i=((n,t)=>r(n.left,n.top,t.left,t.top,t.right,t.top))(n,e.bounds);return!t||i<t.distance?{element:e,distance:i,isBefore:!0,isAfter:!1}:t},null);return t.reduce((t,e)=>{const i=((n,t)=>r(n.left,n.top,t.left,t.bottom-1,t.right,t.bottom-1))(n,e.bounds);return!t||i<t.distance?{element:e,distance:i,isBefore:!1,isAfter:!0}:t},e)||null},horizontal:(n,t)=>{const e=t.reduce((t,e)=>{const i=((n,t)=>r(n.left,n.top,t.left,t.top,t.left,t.bottom))(n,e.bounds);return!t||i<t.distance?{element:e,distance:i,isBefore:!0,isAfter:!1}:t},null);return t.reduce((t,e)=>{const i=((n,t)=>r(n.left,n.top,t.right-1,t.top,t.right-1,t.bottom))(n,e.bounds);return!t||i<t.distance?{element:e,distance:i,isBefore:!1,isAfter:!0}:t},e)||null},all:({left:n,top:t,right:e,bottom:o},{left:a,top:s},g)=>{const d={distance:Math.min(r(a,s,n,t,n+g,t),r(a,s,n,t,n,t+g)),location:i.TopLeft};return[{distance:r(a,s,n+g,t,e-g,t),location:i.Top},{distance:Math.min(r(a,s,e-g,t,e,t),r(a,s,e,t,e,t+g)),location:i.TopRight},{distance:r(a,s,n,t+g,n,o-g),location:i.MiddleLeft},{distance:r(a,s,n+g,t+g,e-g,o-g),location:i.Middle},{distance:r(a,s,e,t+g,e,o-g),location:i.MiddleRight},{distance:Math.min(r(a,s,n,o,n+g,o),r(a,s,n,o,n,o+g)),location:i.BottomLeft},{distance:r(a,s,n+g,o,e-g,o),location:i.Bottom},{distance:Math.min(r(a,s,e-g,o,e,o),r(a,s,e,o,e,o+g)),location:i.BottomRight}].reduce((n,t)=>t.distance<n.distance?t:n,d)}}},570:function(n,t,e){"use strict";e.d(t,"a",function(){return g});var r=e(0),i=e.n(r),o=e(217),a=e(140);class s extends i.a.Component{constructor(n,t){super(n,t),this.onRefContainer=this.onRefContainer.bind(this),this.getBounds=this.getBounds.bind(this)}render(){const{children:n}=this.props;return n({refContainer:this.onRefContainer})}onRefContainer(n){this.__element!==n&&(this.__element=n,this.props.reportRefContainer(this.props.keyData,n?this.getBounds:null),this.props.refContainer&&this.props.refContainer(n))}getBounds(){return this.__element?this.__element.getBoundingClientRect():a.emptyBounds}}const g=({children:n,...t})=>i.a.createElement(o.a,null,({reportRefContainer:e})=>i.a.createElement(s,Object.assign({},t,{reportRefContainer:e}),n))},571:function(n,t,e){"use strict";e.d(t,"a",function(){return a});var r=e(0),i=e.n(r),o=e(217);class a extends i.a.Component{constructor(n,t){super(n,t),this.__registries=[],this.state={registries:this.__registries,element:null},this.reportRefContainer=this.reportRefContainer.bind(this),this.getPositions=this.getPositions.bind(this),this.getPosition=this.getPosition.bind(this),this.onContainerRef=this.onContainerRef.bind(this),this.getBounds=this.getBounds.bind(this)}render(){const n=this.getBounds,t=this.onContainerRef,e=this.state.registries,r=this.props.children({refContainer:t,getBounds:n,registries:e});return i.a.createElement(o.b,{value:this},r)}reportRefContainer(n,t){if(t){if(this.__registries.find(({key:e,getBounds:r})=>n===e&&t===r))return;const e={key:n,getBounds:t},r=[...this.__registries.filter(t=>t.key!==n),e];this.setState({registries:this.__registries=r})}else{if(!this.__registries.find(({key:t})=>n===t))return;const t=this.__registries.filter(t=>t.key!==n);this.setState({registries:this.__registries=t})}}getPositions(){return this.__registries.map(({key:n,getBounds:t})=>({key:n,bounds:t()}))}getPosition(n){const t=this.__registries.find(({key:t})=>n===t);return t?t.getBounds():null}onContainerRef(n){this.state.element!==n&&this.setState({element:n})}getBounds(){return this.state.element?this.state.element.getBoundingClientRect():null}}},91:function(n,t,e){"use strict";e.d(t,"a",function(){return o}),e.d(t,"b",function(){return a});var r=e(0);const i=r.createContext({draggingMeta:null,draggingData:null,onDragging(){console.warn("[@zaibot/react-dnd] missing DraggingProvider")},onDragged(){console.warn("[@zaibot/react-dnd] missing DraggingProvider")}});class o extends r.Component{constructor(n,t){super(n,t),this.onDragging=this.onDragging.bind(this),this.onDragged=this.onDragged.bind(this),this.state={draggingData:null,draggingMeta:null,onDragging:this.onDragging,onDragged:this.onDragged}}render(){return r.createElement(i.Provider,{value:this.state},this.props.children)}onDragging({data:n,meta:t}){this.setState({draggingData:n,draggingMeta:t})}onDragged(){this.setState({draggingData:null})}}const a=n=>{return r.forwardRef((t,e)=>r.createElement(i.Consumer,null,({draggingData:i,draggingMeta:o,onDragged:a,onDragging:s})=>r.createElement(n,Object.assign({},t,{onDragging:s,onDragged:a,draggingData:i,draggingMeta:o,ref:e}))))}}},[[1139,1,2]]]);
//# sourceMappingURL=preview.3c23f349a2636e60a9b3.bundle.js.map