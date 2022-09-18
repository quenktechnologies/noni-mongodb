"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = exports.collections = exports.dropCollection = exports.drop = void 0;
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * drop the database reference supplied.
 */
const drop = (db) => (0, future_1.liftP)(() => db.dropDatabase());
exports.drop = drop;
/**
 * dropColllection from the database reference supplied.
 */
const dropCollection = (db, name) => (0, future_1.fromCallback)(cb => db.dropCollection(name, cb));
exports.dropCollection = dropCollection;
/**
 * collections provides a list of collection instances for each collection in
 * the database.
 */
const collections = (db) => (0, future_1.fromCallback)(cb => db.collections(cb));
exports.collections = collections;
/**
 * createIndex can be used to create an indexes on a collection.
 */
const createIndex = (db, name, spec, opts = {}) => (0, future_1.liftP)(() => db.createIndex(name, spec, opts));
exports.createIndex = createIndex;
//# sourceMappingURL=index.js.map