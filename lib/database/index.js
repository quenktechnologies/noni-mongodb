"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = exports.collections = exports.dropCollection = exports.drop = void 0;
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * drop the database reference supplied.
 */
exports.drop = function (db) {
    return future_1.fromCallback(function (cb) { return db.dropDatabase(cb); });
};
/**
 * dropColllection from the database reference supplied.
 */
exports.dropCollection = function (db, name) {
    return future_1.fromCallback(function (cb) { return db.dropCollection(name, cb); });
};
/**
 * collections provides a list of collection instances for each collection in
 * the database.
 */
exports.collections = function (db) {
    return future_1.fromCallback(function (cb) { return db.collections(cb); });
};
/**
 * createIndex can be used to create an indexes on a collection.
 */
exports.createIndex = function (c, collection, specs, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.createIndex(collection, specs, opts, cb);
    });
};
//# sourceMappingURL=index.js.map