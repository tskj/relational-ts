Relational is a simple in-memory library built on the foundational relational algebra.

A relation is a list of JavaScript objects, called records. In addition it
is also a _function_ from the primary key to the record it specifies. You
can think of the relation as having the following type:

```
relation: (p: PrimaryKey) => Record | undefined
```

where `PrimaryKey` is a subset of `Record`.

Relational provides a simple API to query and combine data stored in a normalized form.
The idea is to store your data, for instance in your Redux store, in a
normal form to reduce data duplication and all the bugs that come with
storing duplicate or nested data.

The API is functional in nature and always returns a new relation without
mutating your data. It is also much nicer to work with than SQL.

## Basic Usage

Create a relation `employees`:

```
const listOfEmployees = [
  {
    id: 0,
    fullname: 'Tarjei S',
    birthDate: new Date('1995'),
    mentorId: 1,
  },
  {
    id: 1,
    fullname: 'Henrik L',
    birthDate: new Date('1992'),
    mentorId: undefined,
  },
  {
    id: 2,
    fullname: 'Emil S',
    birthDate: new Date('1990'),
    mentorId: 0,
  },
  {
    id: 3,
    fullname: 'Morten O',
    birthDate: new Date('1990'),
    mentorId: 0,
  },
  {
    id: 4,
    fullname: 'Mikael B',
    birthDate: new Date('1991'),
    mentorId: 0,
  },
  {
    id: 5,
    fullname: 'Michael N',
    birthDate: new Date('1988'),
    mentorId: 0,
  },
];

const employees = relation(listOfEmployees);
```

---

The records() method extracts the records in the relation as a list:

```
employees.records(); // same as listOfEmployees
```

---

Extract a single employee by applying the relation to an object representing the
primary key of the relation. Undefined if there is no matching record.

```
employees({ id: 0 }); // { id: 0, fullname: 'Tarjei S', ...}
```

---

Filter the relation using the select() method:

```
employees.select(employee => employee.id < 3);
```

---

Select only the columns you need using the project() method:

```
employees.project('fullname', 'birthDate');
```

---

Chain the calls to query the data you need:

```
employees
    .select(employee =>
        employee.fullname.length < 7 && employee.id > 1)
    .project('id', 'fullname')
```

## Advanced usage

One relation is not that interesting though! What we want is to combine
multiple relations. Consider a one-to-many relationship where every
employee might have 0 or many phone numbers, but every phone number
needs an employee.

```
const phoneNumbers = relation([
  { employeeId: 0, phoneNumber: '555 678' },
  { employeeId: 0, phoneNumber: '45459615' },
  { employeeId: 1, phoneNumber: '555 1234' },
]);
```

To combine our two relations we need to `join` them. The `join` method is a
general way of combining the two relations where you specify a predicate which
determines which records are to be joined. However, mostly we just need to
compare one column from each relation, which we can do using the `innerJoin`
method.

```
employees.innerJoin(phoneNumbers)('id')('employeeId');
```

If you only want their names and phone numbers, you can project only those columns:

```
employees.innerJoin(phoneNumbers)('id')('employeeId')
    .project('fullname', 'phoneNumber');

// { fullname: 'Tarjei S', phoneNumber: '555 678' }
// { fullname: 'Tarjei S', phoneNumber: '45459615' }
// { fullname: 'Henrik L', phoneNumber: '555 1234' }
```

---

Consider `mentorId` as a foreign key to `id` in the same relation. We can join
on the same relation as follows:

```
employees.innerJoin(employees)('id')('mentorId')
```

The two records are combined using `Object.assign`, and as such columns with the
same name survive from the right most relation.

---

As usual in relational databases, you would use a "junction relation" to model a
many-to-many relationship. Consider the following group relationships:

```
const groups = relation([
  { groupId: 0, group: 'Gruppe 1' },
  { groupId: 1, group: 'Gruppe 2' },
  { groupId: 2, group: 'Gruppe 3' },
  { groupId: 3, group: 'Gruppe 4' },
  { groupId: 4, group: 'Gruppe 5' },
]);

const groupMemberships = relation([
  { employeeId: 0, groupId: 1 },
  { employeeId: 0, groupId: 2 },
  { employeeId: 2, groupId: 1 },
  { employeeId: 1, groupId: 4 },
]);
```

You would join them as follows to get all the employees with all their group
memberships.

```
empoyees.innerJoin(groupMemberships)('id')('employeeId')
    .innerJoin(groups)('groupId')('groupId');
```

## More Relational Algebra

The fundamental set operations are `intersection`, `difference` and `union`.
To get all employees which are _not_ part of a group, we can first select all
employees which do have a group membership, and then remove them from the
employees relation.

```
const employeesInAGroup =
    employees.innerJoin(groupMemberships)('id')('employeeId');

const employeesWithoutAGroup =
    employees.difference(employeesInAGroup);
```

These basic building blocks can be used to implement pretty much anything,
however some convenience methods are provided.

`map` is a general way of transforming every record in a relation. `update` is
a more restricted version of map, more akin to the SQL update command, which
always produces a relation of the same type. For instance you could capitalize
everyone's name like so:

```
employees.update(e => ({...e, fullname: e.fullname.toUpperCase()}));
```

Similarly, `insert` adds a new record to the relation.

<!--
## Types

## API Doc

## Roadmap
-->
