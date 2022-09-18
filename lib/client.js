"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongo = require("mongodb");
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * connect to a MongoDB database using the driver as client.
 */
const connect = (url, opts = {}) => (0, future_1.fromCallback)(cb => mongo.MongoClient.connect(url, opts, cb));
exports.connect = connect;
/**
 * disconnect a client from its MongoDB database.
 */
const disconnect = (c) => (0, future_1.fromCallback)(cb => c.close(false, cb));
exports.disconnect = disconnect;
//# sourceMappingURL=client.js.map