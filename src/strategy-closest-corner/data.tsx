import { DataKey, IBounds } from "../utils";

export interface IClosestCornerElement {
  readonly key: DataKey;
  readonly bounds: IBounds;
}

export interface IClosestCornerResult {
  readonly isBefore: boolean;
  readonly isAfter: boolean;
  readonly element: IClosestCornerElement;
  readonly distance: number;
}
