import { relation, IRelation } from '../lib/relational';

type EmployeeRecord = { employeeId: number; fullname: string; birthDate: Date };
type EmployeeRelation = IRelation<{ employeeId: number }, EmployeeRecord>;

export const employees: EmployeeRelation = relation([
  {
    employeeId: 0,
    fullname: 'Tarjei S',
    birthDate: new Date('1995')
  },
  {
    employeeId: 1,
    fullname: 'Henrik L',
    birthDate: new Date('1992')
  }
]);

export const groupRel: IRelation<
  { employeeId: number; groupId: number },
  { employeeId: number; groupId: number }
> = relation([
  { employeeId: 0, groupId: 1 },
  { employeeId: 0, groupId: 2 },
  { employeeId: 2, groupId: 1 },
  { employeeId: 1, groupId: 4 }
]);

export const groups: IRelation<
  { groupId: number },
  { groupId: number; group: string }
> = relation([
  { groupId: 0, group: 'Gruppe 1' },
  { groupId: 1, group: 'Gruppe 2' },
  { groupId: 2, group: 'Gruppe 3' },
  { groupId: 3, group: 'Gruppe 4' },
  { groupId: 4, group: 'Gruppe 5' }
]);

let _result = employees
  .join(groupRel)(x => y => x.employeeId === y.employeeId)
  .join(groups)(x => y => x.groupId === y.groupId);

const result = employees
  .innerJoin(groupRel)('employeeId')('employeeId')
  .innerJoin(groups)('groupId')('groupId')
  .select(r => /Tarjei/.test(r.fullname))
  //.map(r => Object.assign({}, r, { fullname: r.fullname.toUpperCase() }))
  .project('fullname', 'birthDate', 'group');

console.log(result.records());
