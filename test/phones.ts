import { relation, IRelation } from '../lib/relational';
import { Employee, EmployeeExtension, employees } from './data';

export type PhoneNumber = {
  employeeId: number;
  phoneNumber: string;
};

export type PhoneNumbers<E> = IRelation<
  { phoneNumber: string },
  PhoneNumber,
  E
>;

export type PhoneExtension = { employee: () => Employee & EmployeeExtension };

const phoneNumberExtension = (n: PhoneNumber) => ({
  employee: () => employees(n),
});

export const phoneNumbers: PhoneNumbers<PhoneExtension> = relation([
  { employeeId: 0, phoneNumber: '555 678' },
  { employeeId: 0, phoneNumber: '45459615' },
  { employeeId: 1, phoneNumber: '555 1234' },
]).extend(phoneNumberExtension);
