import React from "react";
import { storiesOf } from "@storybook/react";
import { closestCorner } from "../src/strategy-closest-corner";
import { ClosestCornerLocation } from "../src/strategy-closest-corner/all";

const stories = storiesOf("react-dnd/Closest Corner", module);

class ClosestCornerHorizonal extends React.Component {
  public state = {
    isOver: false,
    isBefore: false
  };

  public render() {
    const { isOver, isBefore } = this.state;
    return (
      <div
        onMouseMove={this.onMouseMove}
        style={{
          background: `#eee`,
          padding: `5rem`,
          width: `10rem`,
          textAlign: `center`,
          display: `inline-block`
        }}
      >
        {isOver ? (isBefore ? `Left` : `Right`) : `Hover me`}
      </div>
    );
  }

  private onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const position = { left: e.clientX, top: e.clientY };
    const closest = closestCorner.horizontal(position, [{ bounds, key: null }]);
    this.setState({ isOver: !!closest, isBefore: closest.isBefore });
  };
}
class ClosestCornerVertical extends React.Component {
  public state = {
    isOver: false,
    isBefore: false
  };

  public render() {
    const { isOver, isBefore } = this.state;
    return (
      <div
        onMouseMove={this.onMouseMove}
        style={{
          background: `#eee`,
          padding: `5rem`,
          width: `10rem`,
          textAlign: `center`,
          display: `inline-block`
        }}
      >
        {isOver ? (isBefore ? `Top` : `Bottom`) : `Hover me`}
      </div>
    );
  }

  private onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const position = { left: e.clientX, top: e.clientY };
    const closest = closestCorner.vertical(position, [{ bounds, key: null }]);
    this.setState({ isOver: !!closest, isBefore: closest.isBefore });
  };
}
class ClosestCornerAll extends React.Component {
  public state = {
    isOver: false,
    distance: 0,
    location: ClosestCornerLocation.Middle
  };

  public render() {
    const { isOver, distance, location } = this.state;
    return (
      <div
        onMouseMove={this.onMouseMove}
        style={{
          background: `#eee`,
          padding: `5rem`,
          width: `10rem`,
          textAlign: `center`,
          display: `inline-block`
        }}
      >
        {isOver
          ? `${this.locationToString(location)} @ ${distance.toFixed(1)}px`
          : `Hover me`}
      </div>
    );
  }

  private locationToString(location: ClosestCornerLocation) {
    switch (location) {
      case ClosestCornerLocation.TopLeft:
        return `Top Left`;
      case ClosestCornerLocation.Top:
        return `Top`;
      case ClosestCornerLocation.TopRight:
        return `Top Right`;
      case ClosestCornerLocation.MiddleLeft:
        return `Middle Left`;
      case ClosestCornerLocation.Middle:
        return `Middle`;
      case ClosestCornerLocation.MiddleRight:
        return `Middle Right`;
      case ClosestCornerLocation.BottomLeft:
        return `Bottom Left`;
      case ClosestCornerLocation.Bottom:
        return `Bottom`;
      case ClosestCornerLocation.BottomRight:
        return `Bottom Right`;
      default:
        return `???`;
    }
  }

  private onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const position = { left: e.clientX, top: e.clientY };
    const closest = closestCorner.all(position, bounds, 20);
    this.setState({
      isOver: !!closest,
      distance: closest.distance,
      location: closest.location
    });
  };
}

stories
  .add(`Horizontal`, () => <ClosestCornerHorizonal />)
  .add(`Vertical`, () => <ClosestCornerVertical />)
  .add(`All`, () => <ClosestCornerAll />);
