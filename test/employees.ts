import { relation, IRelation } from '../lib/relational';
import {
  phoneNumbers,
  PhoneNumbers,
  groupMemberships,
  groups,
  Groups,
} from './data';

export type Employee = {
  employeeId: number;
  fullname: string;
  birthDate: Date;
  mentorId: number;
};

export type Employees<E> = IRelation<{ employeeId: number }, Employee, E>;

export type EmployeeExtension = {
  groups: () => Groups<{}>;
  mentor: () => Employee & EmployeeExtension;
  phoneNumbers: () => PhoneNumbers<{}>;
};

const employeeExtension = (e: Employee) => ({
  groups: () =>
    groupMemberships
      .innerJoin(groups)('groupId')('groupId')
      .select(g => g.employeeId === e.employeeId)
      .project('groupId', 'group') as Groups<{}>,
  mentor: () => employees({ employeeId: e.mentorId }),
  phoneNumbers: () =>
    employees
      .innerJoin(phoneNumbers)('employeeId')('employeeId')
      .select(p => p.employeeId === e.employeeId),
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
