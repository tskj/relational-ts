import { relation, IRelation } from '../lib/relational';
import { employees, Employee, EmployeeExtension } from './employees';

export type RateHistory = {
  employeeId: number;
  startDate: Date;
  rate: number;
};

export type RateExtension = {
  employees: () => Employee & EmployeeExtension;
};

export type RateHistories<E> = IRelation<
  { employeeId: number; startDate: Date },
  RateHistory,
  E
>;

const rateExtension = (r: RateHistory) => ({
  employee: () => employees(r),
});

export const rateHistories: RateHistories<RateExtension> = relation([
  {
    employeeId: 0,
    startDate: new Date('1995'),
    rate: 0,
  },
  {
    employeeId: 0,
    startDate: new Date('2018'),
    rate: 100,
  },
  {
    employeeId: 1,
    startDate: new Date('2017'),
    rate: 100,
  },
]);
