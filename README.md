# `clean-mongo`

Here's the deal. You're running tests, and you want a clean slate on your MongoDB test database.

`clean-mongo` will open a MongoDB connection, and will __destroy all data,__ giving you a fresh, clean database. Ready to use for tests.

## Installation

```
npm install --save clean-mongo
```

## Usage

Use the `cleanMongo` function by passing it the database connection URL, in the same way as the native `mongodb` driver's `MongoClient` constructor.

The `cleanMongo` function returns a Promise for the database connection instance.

```js
var cleanMongo = require('clean-mongo');

cleanMongo('mongodb://localhost/my-test-database').then(function(db) {

  // Here's your fresh db instance, ready to run.
  console.log(db.databaseName) // 'my-test-database'

  db.collection('documents')...

})

```

## Ava test example

I use [ava](https://github.com/avajs/ava) for tests. Here's a quick way to use `clean-mongo`.

```js
// Before each test, get a clean database.
test.beforeEach(t => {
  // Because we return this promise, ava will wait for it to resolve
  // before continuing to the tests.
  return cleanMongo('mongodb://localhost/my-test-database').then(db => {
    // We can use t.context to provide the db to our tests.
    t.context.db = db;
  });
});

// Use the database in a test.
test(t => {
  t.context.db.collection('documents').find({}).toArray().then(results => {
    t.is(results.length, 0); // It should be empty!
  });
});
```