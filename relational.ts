type Filter<T, U> = T extends U ? T : never;

const k = <V>(obj: {k: V}) => obj['k'];
const a = <V>(obj: {a: V}) => obj['a'];

interface Relation<P, R extends P> {
    records: R[];
    (primaryKey: P): R | undefined;
}

type Record1 = { k: string; a: string };
type Relation1 = Relation<{ k: string; a: string }, Record1>;

const join =
    <A, B>(p: (xs: A) => (ys: B) => boolean) =>
    (xs: A[]) =>
    (ys: B[]): (A & B)[] =>
        xs.map(x =>
            ys.map(y =>
                p(x)(y) ? Object.assign({}, x, y) : undefined))
            .reduce((acc, val) => acc.concat(val), [])
            .filter(x => x !== undefined) as (A & B)[];


const result = join(x => y => x['k'] === y['k'])([{
    a: 'a',
    k: 'k',
}, {
    a: 'a2',
    k: 'k',
}])([{
    k: 'k',
    b: 'b',
    c: 'c',
}, {
    k: 'k2',
    b: 'b2',
    c: 'c2',
}]);

console.log(result);
