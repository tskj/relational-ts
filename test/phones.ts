import { relation, IRelation } from '../lib/relational';

type PhoneNumber = {
  employeeId: number;
  phoneNumber: string;
};

type PhoneNumbers = IRelation<{ phoneNumber: string }, PhoneNumber>;

export const phoneNumbers: PhoneNumbers = relation([
  { employeeId: 0, phoneNumber: '555 678' },
  { employeeId: 0, phoneNumber: '45459615' },
  { employeeId: 1, phoneNumber: '555 1234' },
]);
