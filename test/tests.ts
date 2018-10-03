import {
  rateHistories,
  phoneNumbers,
  employees,
  groupMemberships,
  groups,
} from './data';

const _result = employees
  .join(groupMemberships)(x => y => x.employeeId === y.employeeId)
  .join(groups)(x => y => x.groupId === y.groupId);

console.log(_result);

const result = employees
  .innerJoin(groupMemberships)('employeeId')('employeeId')
  .innerJoin(groups)('groupId')('groupId')
  .select(r => /Tarjei/.test(r.fullname))
  //.map(r => Object.assign({}, r, { fullname: r.fullname.toUpperCase() }))
  .project('fullname', 'birthDate', 'group');

console.log(result.records());

console.log(employees({ employeeId: 0 }));

console.log(phoneNumbers({ phoneNumber: '45459615' }));

console.log(
  employees
    .project('employeeId')
    .difference(rateHistories.project('employeeId'))
    .map(r => ({
      ...r,
      startDate: employees(r as any).birthDate,
      rate: 100,
    }))
    .union(employees.innerJoin(rateHistories)('employeeId')(
      'employeeId'
    ) as any)
    .records()
);
