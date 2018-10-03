import { relation, IRelation } from '../lib/relational';

type RateHistory = {
  employeeId: number;
  startDate: Date;
  rate: number;
};

type RateHistories = IRelation<
  { employeeId: number; startDate: Date },
  RateHistory
>;

export const rateHistories: RateHistories = relation([
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
