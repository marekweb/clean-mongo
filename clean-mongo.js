var debug = require('debug')('clean-mongo');
var MongoClient = require('mongodb').MongoClient;

module.exports = function connectToFreshMongo(url) {
  return MongoClient.connect(url).then(db => {
    function dropCollection(collectionName) {
      if (collectionName.startsWith('system.')) {
        // For system collections:
        // Remove all contents (indices, etc)
        // This sometimes doesn't work ('cannot delete from system namespace').
        // But that's probably okay.
        debug(`${db.databaseName}.${collectionName} is being emptied`);
        return db.collection(collectionName).remove({}).catch(err => {
          debug('failed to drop:', err.message);
        });
      }
      // For regular collections:
      // Drop the collection
      debug(`${db.databaseName}.${collectionName} is being dropped`);
      return db.collection(collectionName).drop().catch(err => {
        debug('failed to drop:', err.message);
      });
    }

    return db.listCollections().toArray().then(collections => {
      var dropPromises = collections
        .map(c => c.name)
        .map(dropCollection);

      return Promise.all(dropPromises).then(() => db);
    });
  });
};
