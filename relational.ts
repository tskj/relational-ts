import { Relation, IRelation } from "./types";

const employeeId = <V>(obj: { employeeId: V }) => obj["employeeId"];
const fullname = <V>(obj: { fullname: V }) => obj["fullname"];
const birthDate = <V>(obj: { birthDate: V }) => obj["birthDate"];
const groupId = <V>(obj: { groupId: V }) => obj["groupId"];
const group = <V>(obj: { group: V }) => obj["group"];

type EmployeeRecord = { employeeId: number; fullname: string; birthDate: Date };
type EmployeeRelation = IRelation<{ employeeId: number }, EmployeeRecord>;

const employees: EmployeeRelation = Relation([
  {
    employeeId: 0,
    fullname: "Tarjei S",
    birthDate: new Date("1995")
  },
  {
    employeeId: 1,
    fullname: "Henrik L",
    birthDate: new Date("1993")
  }
]);

const groupRel: IRelation<
  { employeeId: number; groupId: number },
  { employeeId: number; groupId: number }
> = Relation([
  { employeeId: 0, groupId: 1 },
  { employeeId: 0, groupId: 2 },
  { employeeId: 2, groupId: 1 },
  { employeeId: 1, groupId: 4 }
]);

const groups: IRelation<
  { groupId: number },
  { groupId: number; group: string }
> = Relation([
  { groupId: 0, group: "Gruppe 1" },
  { groupId: 1, group: "Gruppe 2" },
  { groupId: 2, group: "Gruppe 3" },
  { groupId: 3, group: "Gruppe 4" },
  { groupId: 4, group: "Gruppe 5" }
]);

// let result = employees
//   .join(groupRel)(x => y => employeeId(x) === employeeId(y))
//   .join(groups)(x => y => groupId(x) === groupId(y));

const result = employees
  .innerJoin(groupRel)(employeeId)(employeeId)
  .innerJoin(groups)(groupId)(groupId)
  .select(r => fullname(r) === "Tarjei S")
  .project(["fullname", "birthDate", "group"]);

console.log(result.records);
