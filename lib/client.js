"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
var mongo = require("mongodb");
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * connect to a MongoDB database using the driver as client.
 */
var connect = function (url, opts) {
    if (opts === void 0) { opts = {}; }
    return (0, future_1.fromCallback)(function (cb) { return mongo.MongoClient.connect(url, opts, cb); });
};
exports.connect = connect;
/**
 * disconnect a client from its MongoDB database.
 */
var disconnect = function (c) {
    return (0, future_1.fromCallback)(function (cb) { return c.close(false, cb); });
};
exports.disconnect = disconnect;
//# sourceMappingURL=client.js.map