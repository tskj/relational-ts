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
