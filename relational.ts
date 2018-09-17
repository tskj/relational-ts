import { Relation, IRelation } from "./types";

const id = <V>(obj: { id: V }) => obj["id"];
const fullname = <V>(obj: { fullname: V }) => obj["fullname"];
const birthDate = <V>(obj: { birthDate: V }) => obj["birthDate"];
const groupId = <V>(obj: { groupId: V }) => obj["groupId"];
const group = <V>(obj: { group: V }) => obj["group"];

type EmployeeRecord = { id: number; fullname: string; birthDate: Date };
type EmployeeRelation = IRelation<{ id: number }, EmployeeRecord>;

const employees: EmployeeRelation = Relation([
  {
    id: 0,
    fullname: "Tarjei S",
    birthDate: new Date("1995")
  },
  {
    id: 1,
    fullname: "Henrik L",
    birthDate: new Date("1992")
  }
]);

const groupRel: IRelation<
  { id: number; groupId: number },
  { id: number; groupId: number }
> = Relation([
  { id: 0, groupId: 1 },
  { id: 0, groupId: 2 },
  { id: 2, groupId: 1 },
  { id: 1, groupId: 4 }
]);

const groups: IRelation<
  { id: number },
  { id: number; group: string }
> = Relation([
  { id: 0, group: "Gruppe 1" },
  { id: 1, group: "Gruppe 2" },
  { id: 2, group: "Gruppe 3" },
  { id: 3, group: "Gruppe 4" },
  { id: 4, group: "Gruppe 5" }
]);

const result = employees
  .join(groupRel)(x => y => id(x) === id(y))
  .join(groups)(x => y => groupId(x) === id(y));

console.log(result.records);
