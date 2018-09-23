import { relation, IRelation } from '../lib/relational';
import { employees, Employees } from './employees';
import { groupMemberships } from './group-memberships';

type Group = {
  groupId: number;
  group: string;
};

export type Groups<E> = IRelation<{ groupId: number }, Group, E>;

type GroupExtension = {
  members: () => Employees<{}>;
};

const groupExtension = g => ({
  members: () =>
    groupMemberships
      .innerJoin(employees)('employeeId')('employeeId')
      .select(m => m.groupId === g.groupId)
      .project('employeeId', 'fullname', 'birthDate') as Employees<{}>,
});

export const groups: Groups<GroupExtension> = relation([
  { groupId: 0, group: 'Gruppe 1' },
  { groupId: 1, group: 'Gruppe 2' },
  { groupId: 2, group: 'Gruppe 3' },
  { groupId: 3, group: 'Gruppe 4' },
  { groupId: 4, group: 'Gruppe 5' },
]).extend(groupExtension);
