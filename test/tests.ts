import { phoneNumbers, employees, groupMemberships, groups } from './data';

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
