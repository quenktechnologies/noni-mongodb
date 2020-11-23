"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = exports.collections = exports.dropCollection = exports.drop = void 0;
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * drop the database reference supplied.
 */
var drop = function (db) {
    return future_1.fromCallback(function (cb) { return db.dropDatabase(cb); });
};
exports.drop = drop;
/**
 * dropColllection from the database reference supplied.
 */
var dropCollection = function (db, name) {
    return future_1.fromCallback(function (cb) { return db.dropCollection(name, cb); });
};
exports.dropCollection = dropCollection;
/**
 * collections provides a list of collection instances for each collection in
 * the database.
 */
var collections = function (db) {
    return future_1.fromCallback(function (cb) { return db.collections(cb); });
};
exports.collections = collections;
/**
 * createIndex can be used to create an indexes on a collection.
 */
var createIndex = function (c, collection, specs, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.createIndex(collection, specs, opts, cb);
    });
};
exports.createIndex = createIndex;
//# sourceMappingURL=index.js.map