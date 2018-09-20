import { IRelation } from './types';
export { IRelation } from './types';

export const relation = <P, R extends P>(records: R[]): IRelation<P, R> => {
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
      return recs[recs.length - 1];
    } else {
      return undefined;
    }
  }) as IRelation<P, R>;

  (that as IRelation<P, R>).records = () => records;

  (that as IRelation<P, R>).join = y => p => {
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

  (that as IRelation<P, R>).innerJoin = y => ex => ey => {
    // Todo: figure out how to restrain the types to match in the signature
    return that.join(y)(xn => yn => (xn[ex] as any) === yn[ey]);
  };

  (that as IRelation<P, R>).map = f => relation(that.records().map(f));

  (that as IRelation<P, R>).project = (...fields) =>
    relation(
      that
        .records()
        .map(r =>
          fields
            .map(field => ({ [field]: r[field] }))
            .reduce((x, y) => Object.assign({}, x, y), {})
        )
    );

  (that as IRelation<P, R>).select = p => relation(that.records().filter(p));

  (that as IRelation<P, R>).union = y =>
    relation(that.records().concat(y.records()));

  return that;
};
