import { IRelation } from './types';
export { IRelation } from './types';

export const relation = <P, R extends P, E>(
  records: R[]
): IRelation<P, R, E> => {
  const that = ((p: P) => {
    const recs = records.filter(that.equals(p));
    if (recs.length > 0) {
      return recs[recs.length - 1];
    } else {
      return undefined;
    }
  }) as IRelation<P, R, E>;

  that['equals'] = r1 => r2 => {
    let eq = true;
    for (const key in r2) {
      if (r1[key] !== undefined && r1[key] !== r2[key]) {
        eq = false;
      }
    }
    return eq;
  };

  (that as IRelation<P, R, E>).records = () => records;

  (that as IRelation<P, R, E>).join = y => p => {
    const x = that.records();
    switch (x.length) {
      case 0:
        return relation([]);
      default:
        return relation(
          y
            .records()
            .filter(y0 => p(x[0])(y0))
            .map(y0 => Object.assign({}, x[0], y0))
            .concat(
              relation(x.slice(1))
                .join(y)(p)
                .records()
            )
        );
    }
  };

  (that as IRelation<P, R, E>).innerJoin = y => ex => ey => {
    // Todo: figure out how to restrain the types to match in the signature
    return that.join(y)(xn => yn => (xn[ex] as any) === yn[ey]);
  };

  (that as IRelation<P, R, E>).map = f => relation(that.records().map(f));

  (that as IRelation<P, R, E>).project = (...fields) =>
    relation(
      that
        .records()
        .map(r =>
          fields
            .map(field => ({ [field]: r[field] }))
            .reduce((x, y) => Object.assign({}, x, y), {})
        )
    );

  (that as IRelation<P, R, E>).select = p => relation(that.records().filter(p));

  (that as IRelation<P, R, E>).insert = r => that.union([r]);

  (that as IRelation<P, R, E>).union = y =>
    relation(that.records().concat(y.records()));

  (that as IRelation<P, R, E>).intersection = ys =>
    relation(
      that.records().filter(
        r =>
          ys
            .records()
            .map(y => r.equals(y))
            .filter(t => (t ? true : false)).length > 0
      )
    );

  (that as IRelation<P, R, E>).difference = ys =>
    relation(
      that.records().filter(
        r =>
          ys
            .records()
            .map(y => r.equals(y))
            .filter(t => t).length > 0
      )
    );

  (that as IRelation<P, R, E>).intersection = ys =>
    relation(
      that.records().filter(
        r =>
          ys
            .records()
            .map(y => r.equals(y))
            .filter(t => t).length === 0
      )
    );

  (that as IRelation<P, R, E>).extend = <T>(f: (ex: R) => T) => {
    let newrel = (p: P): R & T => {
      const r = that(p);
      if (!r) {
        return undefined;
      }
      return Object.assign({}, r, f(r));
    };
    for (const key in that) {
      newrel[key] = that[key];
    }
    return newrel as IRelation<P, R, T>;
  };

  return that;
};
