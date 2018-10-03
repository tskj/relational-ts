import { relation, IRelation } from '../lib/relational';

type GroupMembership = { employeeId: number; groupId: number };
type GroupMemberships = IRelation<GroupMembership, GroupMembership>;

export const groupMemberships: GroupMemberships = relation([
  { employeeId: 0, groupId: 1 },
  { employeeId: 0, groupId: 2 },
  { employeeId: 2, groupId: 1 },
  { employeeId: 1, groupId: 4 },
]);
