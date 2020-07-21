"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
var mongo = require("mongodb");
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * connect to a MongoDB database using the driver as client.
 */
exports.connect = function (url, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return mongo.MongoClient.connect(url, opts, cb); });
};
/**
 * disconnect a client from its MongoDB database.
 */
exports.disconnect = function (c) {
    return future_1.fromCallback(function (cb) { return c.close(false, cb); });
};
//# sourceMappingURL=client.js.map