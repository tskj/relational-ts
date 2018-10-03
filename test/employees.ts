import { relation, IRelation } from '../lib/relational';

type Employee = {
  employeeId: number;
  fullname: string;
  birthDate: Date;
  mentorId: number;
};

type Employees = IRelation<{ employeeId: number }, Employee>;

export const employees: Employees = relation([
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
]);
