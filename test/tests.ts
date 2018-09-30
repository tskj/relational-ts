import {
  rateHistories,
  phoneNumbers,
  employees,
  groupMemberships,
  groups,
} from './data';

import { relation } from '../lib/relational';

let _result = employees
  .join(groupMemberships)(x => y => x.employeeId === y.employeeId)
  .join(groups)(x => y => x.groupId === y.groupId);

const result = employees
  .innerJoin(groupMemberships)('employeeId')('employeeId')
  .innerJoin(groups)('groupId')('groupId')
  .select(r => /Tarjei/.test(r.fullname))
  //.map(r => Object.assign({}, r, { fullname: r.fullname.toUpperCase() }))
  .project('fullname', 'birthDate', 'group');

console.log(result.records());
console.log(
  employees({ employeeId: 0 })
    .groups()
    .records()
    .map(g =>
      groups(g)
        .members()
        .records()
    )
);
console.log(
  employees({ employeeId: 2 })
    .mentor()
    .mentor()
    .groups()
    .records()
);

console.log(
  employees({ employeeId: 0 })
    .phoneNumbers()
    .records()
);

console.log(
  phoneNumbers({ phoneNumber: '45459615' })
    .employee()
    .phoneNumbers()
    .records()
);

console.log(
  employees
    .project('employeeId')
    .difference(rateHistories.project('employeeId'))
    .map(r => ({
      // difference API is not types correctly, which leads to 'as any'
      ...employees(r as any),
      startDate: employees(r as any).birthDate,
      rate: 100,
    }))
    .union(employees.innerJoin(rateHistories)('employeeId')(
      'employeeId'
    ) as any)
    .records()
);
