export type Diff<T extends PropertyKey, U extends PropertyKey> = ({
  [P in T]: P
} &
  { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = { [P in Diff<keyof T, K>]: T[P] };
export type Minus<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>>;
