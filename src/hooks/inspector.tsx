import React from "react";
import { useDnD } from "./context";
import { useMeasurements } from "./measure";
import { useDragState } from "./state";

export const DnDInspector = () => {
  const { session } = useDnD();
  const { dragging, dropping, dropped } = useDragState(session);
  const measurements = useMeasurements();

  return (
    <>
      <pre style={{ fontSize: `10px` }}>
        <div style={{ marginTop: `-5px` }}>Dragging</div>
        {(dragging &&
          JSON.stringify(dragging, undefined, 4).substring(0, 800)) ||
          `-`}
      </pre>

      <pre style={{ fontSize: `10px` }}>
        <div style={{ marginTop: `-5px` }}>Dropping</div>
        {(dropping &&
          JSON.stringify(dropping, undefined, 4).substring(0, 800)) ||
          `-`}
      </pre>

      <pre style={{ fontSize: `10px` }}>
        <div style={{ marginTop: `-5px` }}>Dropped</div>
        {(dropped && JSON.stringify(dropped, undefined, 4).substring(0, 800)) ||
          `-`}
      </pre>

      <pre style={{ fontSize: `10px` }}>
        <div style={{ marginTop: `-5px` }}>Measurements</div>
        {JSON.stringify(measurements.bounds, undefined, 4).substring(0, 800) ||
          `-`}
      </pre>
    </>
  );
};
