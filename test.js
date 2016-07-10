import test from 'ava';

process.env.DEBUG = '*';
const cleanMongo = require('./clean-mongo');

const databaseName = 'test';
const databaseURL = 'mongodb://localhost/' + databaseName;

test.beforeEach(t => {
  // Because we return this promise, ava will wait for it to resolve before
  return cleanMongo(databaseURL).then(db => {
    // We can use t.context to provide the db to our tests.
    t.context.db = db;
  });
});

test.serial('should connect to the db', t => {
  t.is(t.context.db.databaseName, databaseName);
});

test.serial('should be empty', t => {
  t.context.db.collection('documents').find({}).toArray().then(results => {
    t.is(results.length, 0);
  });
});

test.serial('should be cleaned after insert', t => {
  t.context.db.collection('documents').insertOne({
    name: 'test',
    value: 100
  }).then(result => {
    t.is(result.insertedCount, 1);

    cleanMongo(databaseURL).then(db => {
      return db.collection('documents').find({}).toArray();
    }).then(results => {
      // Still must be zero, after insertion
      t.is(results.length, 0);
    });
  });
});
