type Constr<T, U, KS extends keyof T> = {
  [K in KS]: T[K] extends U ? K : never
}[KS];

export interface IRelation<P, R extends P> {
  records: () => R[];
  (primaryKey: P): R | undefined;
  join: <P2, R2 extends P2>(
    y: IRelation<P2, R2>
  ) => (p: (x: R) => (y: R2) => boolean) => IRelation<P & P2, R & R2>;
  innerJoin: <
    P2,
    R2 extends P2,
    V1 extends keyof R,
    // This doesn't quite work
    V2 extends Constr<R2, R[V1], keyof R2>
  >(
    y: IRelation<P2, R2>
  ) => (ex: V1) => (ey: V2) => IRelation<P & P2, R & R2>;
  project: <K extends keyof R>(
    ...fields: K[]
  ) => IRelation<{}, { [P in K]: R[K] }>;
  select: (p: ((r: R) => boolean)) => IRelation<P, R>;

  intersection: (y: IRelation<P, R>) => IRelation<P, R>;
  difference: (y: IRelation<P, R>) => IRelation<P, R>;
  union: (y: IRelation<P, R>) => IRelation<P, R>;

  map: <R2 extends P>(f: (r: R) => R2) => IRelation<P, R2>;
  update: (f: (r: R) => R) => IRelation<P, R>;
  insert: (r: R) => IRelation<P, R>;
}
