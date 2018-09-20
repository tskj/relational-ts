type Constr<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export interface IRelation<P, R extends P> {
  records: () => R[];
  (primaryKey: P): R | undefined;
  join: <P2, R2 extends P2>(
    y: IRelation<P2, R2>
  ) => (p: (x: R) => (y: R2) => boolean) => IRelation<P & P2, R & R2>;
  innerJoin: <
    P2,
    R2 extends P2,
    V1 extends Constr<R, R2[V2]>,
    V2 extends Constr<R2, R[V1]>
  >(
    y: IRelation<P2, R2>
  ) => (ex: V1) => (ey: V2) => IRelation<P & P2, R & R2>;
  project: (
    ...fields: (keyof R)[]
  ) => IRelation<{}, { [x: string]: R[keyof R] }>;
  select: (p: ((r: R) => boolean)) => IRelation<P, R>;
  union: (y: IRelation<P, R>) => IRelation<P, R>;

  map: <R2 extends P>(f: (r: R) => R2) => IRelation<P, R2>;
}
