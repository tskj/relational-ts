type Optional<T> = Some<T> | None;

type Some<T> = {
  kind: "Some";
  value: T;
};

type None = {
  kind: "None";
};

export interface IRelation<P, R extends P> {
  records: R[];
  (primaryKey: P): Optional<R>;
  join: <P2, R2 extends P2>(
    y: IRelation<P2, R2>
  ) => (p: (x: R) => (y: R2) => boolean) => IRelation<P & P2, R & R2>;
}

export const Relation = <P, R extends P>(records: R[]): IRelation<P, R> => {
  const that = ((p: P) => {
    const recs = records.filter(r => {
      let eq = true;
      for (const key in p) {
        if (r[key] !== p[key]) {
          eq = false;
        }
      }
      return eq;
    });
    if (recs.length > 0) {
      return {
        kind: "Some",
        value: recs[0]
      };
    } else {
      return { kind: "None" };
    }
  }) as IRelation<P, R>;

  (that as IRelation<P, R>).records = records;

  (that as IRelation<P, R>).join = y => p => {
    const x = that.records;
    switch (x.length) {
      case 0:
        return Relation([]);
      default:
        return Relation(
          y.records
            .filter(y0 => p(x[0])(y0))
            .map(y0 => Object.assign({}, x[0], y0))
            .concat(Relation(x.slice(1)).join(y)(p).records)
        );
    }
  };

  return that;
};
