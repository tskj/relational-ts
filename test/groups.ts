import { relation, IRelation } from '../lib/relational';

type Group = {
  groupId: number;
  group: string;
};

type Groups = IRelation<{ groupId: number }, Group>;

export const groups: Groups = relation([
  { groupId: 0, group: 'Gruppe 1' },
  { groupId: 1, group: 'Gruppe 2' },
  { groupId: 2, group: 'Gruppe 3' },
  { groupId: 3, group: 'Gruppe 4' },
  { groupId: 4, group: 'Gruppe 5' },
]);
