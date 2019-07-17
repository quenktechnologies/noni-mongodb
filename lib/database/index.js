"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=index.js.map