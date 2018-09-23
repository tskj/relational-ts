import { relation, IRelation } from '../lib/relational';
import { groupMemberships } from './group-memberships';
import { groups, Groups } from './groups';

type Employee = { employeeId: number; fullname: string; birthDate: Date };

export type Employees<E> = IRelation<{ employeeId: number }, Employee, E>;

type EmployeeExtension = {
  groups: () => Groups<{}>;
  mentor: () => Employee & EmployeeExtension;
};

const employeeExtension = e => ({
  groups: () =>
    groupMemberships
      .innerJoin(groups)('groupId')('groupId')
      .select(g => g.employeeId === e.employeeId)
      .project('groupId', 'group') as Groups<{}>,
  mentor: () => employees({ employeeId: e.mentorId }),
});

export const employees: Employees<EmployeeExtension> = relation([
  {
    employeeId: 0,
    fullname: 'Tarjei S',
    birthDate: new Date('1995'),
    mentorId: 1,
  },
  {
    employeeId: 1,
    fullname: 'Henrik L',
    birthDate: new Date('1992'),
    mentorId: undefined,
  },
  {
    employeeId: 2,
    fullname: 'Emil S',
    birthDate: new Date('2001'),
    mentorId: 0,
  },
]).extend(employeeExtension);
