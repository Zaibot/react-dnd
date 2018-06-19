export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<Extract<keyof T, string>, Extract<K, string>>>;

// TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/26510
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#typescript-29
