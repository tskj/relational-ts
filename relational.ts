import { Relation, IRelation } from "./types";

const id = <V>(obj: { id: V }) => obj["id"];
const fullname = <V>(obj: { fullname: V }) => obj["fullname"];
const birthDate = <V>(obj: { birthDate: V }) => obj["birthDate"];

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

const coolGuys: IRelation<{ id: number }, { id: number }> = Relation([
  { id: 0 }
]);

const result = employees.join(coolGuys)(x => y => id(x) === id(y));

console.log(result.records);
