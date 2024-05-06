export type ArrayItem<A extends unknown[]> = A extends (infer E)[] ? E : never;
