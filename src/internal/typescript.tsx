export type Minus<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>>;
