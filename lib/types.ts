type Constr<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export interface IRelation<P, R extends P, E> {
  records: () => R[];
  (primaryKey: P): R & E | undefined;
  join: <P2, R2 extends P2>(
    y: IRelation<P2, R2, any>
  ) => (p: (x: R) => (y: R2) => boolean) => IRelation<P & P2, R & R2, {}>;
  innerJoin: <
    P2,
    R2 extends P2,
    V1 extends Constr<R, R2[V2]>,
    V2 extends Constr<R2, R[V1]>
  >(
    y: IRelation<P2, R2, any>
  ) => (ex: V1) => (ey: V2) => IRelation<P & P2, R & R2, {}>;
  project: (
    ...fields: (keyof R)[]
  ) => IRelation<{}, { [x: string]: R[keyof R] }, {}>;
  select: (p: ((r: R) => boolean)) => IRelation<P, R, E>;

  intersection: (y: IRelation<P, R, E>) => IRelation<P, R, E>;
  difference: (y: IRelation<P, R, E>) => IRelation<P, R, E>;
  union: (y: IRelation<P, R, E>) => IRelation<P, R, E>;

  map: <R2 extends P>(f: (r: R) => R2) => IRelation<P, R2, {}>;
  update: (f: (r: R) => R) => IRelation<P, R, E>;
  insert: (r: R) => IRelation<P, R, E>;

  extend: <T>(
    extensionMethods: (record: R) => T
  ) => IRelation<P, R, FunctionProperties<T>>;
}
