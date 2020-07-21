"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexes = exports.populateN = exports.populate = exports.aggregate = exports.deleteMany = exports.deleteOne = exports.updateMany = exports.updateOne = exports.count = exports.findOneAndUpdate = exports.find = exports.findOne = exports.insertMany = exports.insertOne = void 0;
var future_1 = require("@quenk/noni/lib/control/monad/future");
var array_1 = require("@quenk/noni/lib/data/array");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * insertOne document into a collection.
 */
exports.insertOne = function (c, doc, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.insertOne(doc, opts, cb); });
};
/**
 * insertMany documents into a collection.
 */
exports.insertMany = function (c, docs, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.insertMany(docs, opts, cb); });
};
/**
 * findOne document in a collection.
 */
exports.findOne = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.findOne(qry, opts, cb); })
        .map(function (r) { return maybe_1.fromNullable(r); });
};
/**
 * find documents in a collection.
 */
exports.find = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.find(qry, opts).toArray(cb); });
};
/**
 * findOneAndUpdate a document in a collection.
 */
exports.findOneAndUpdate = function (c, filter, update, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.findOneAndUpdate(filter, update, opts, cb);
    })
        .map(function (r) { return r.ok ? maybe_1.fromNullable(r.value) : maybe_1.nothing(); });
};
/**
 * count the number of documents in a collection that match a query.
 */
exports.count = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.countDocuments(qry, opts, cb); });
};
/**
 * updateOne document in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
exports.updateOne = function (c, qry, updateSpec, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.updateOne(qry, updateSpec, opts, cb); });
};
/**
 * updateMany documents in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
exports.updateMany = function (c, qry, updateSpec, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.updateMany(qry, updateSpec, opts, cb); });
};
/**
 * deleteOne document in a collection.
 */
exports.deleteOne = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.deleteOne(qry, opts, cb); });
};
/**
 * deleteMany documents in a collection.
 */
exports.deleteMany = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.deleteMany(qry, opts, cb); });
};
/**
 * aggregate applies an aggregation pipeline to a collection
 */
exports.aggregate = function (c, p, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.doFuture(function () {
        var cursor, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, future_1.fromCallback(function (cb) { return c.aggregate(p, opts, cb); })];
                case 1:
                    cursor = _a.sent();
                    return [4 /*yield*/, future_1.fromCallback(function (cb) { return cursor.toArray(cb); })];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, future_1.fromCallback(function (cb) { return cursor.close(cb); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, future_1.pure(data)];
            }
        });
    });
};
/**
 * populate is a helper function for "linking" data nested in a
 * document.
 *
 * It works by replacing the occurence of a target key with a document
 * in another collection using the target key's value as the _id reference.
 */
exports.populate = function (c, ref, mData, fields) {
    var _a, _b;
    //disable _id unless its set.
    fields._id = (fields._id === 1) ? 1 : 0;
    if (mData.isNothing())
        return future_1.pure(mData);
    var data = mData.get();
    if (Array.isArray(data[ref[0]])) {
        return exports.find(c, (_a = {}, _a[ref[1]] = { $in: data[ref[0]] }, _a), { fields: fields })
            .chain(function (mr) {
            if (!array_1.empty(mr))
                data[ref[0]] = mr;
            else
                data[ref[0]] = [];
            return future_1.pure(maybe_1.just(data));
        });
    }
    else {
        return exports.findOne(c, (_b = {}, _b[ref[1]] = data[ref[0]], _b), { fields: fields })
            .chain(function (mr) {
            if (mr.isJust())
                data[ref[0]] = mr.get();
            else
                delete data[ref[0]];
            return future_1.pure(maybe_1.just(data));
        });
    }
};
/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default.
 */
exports.populateN = function (c, refs, data, fields, n) {
    if (n === void 0) { n = 100; }
    if (!array_1.empty(data)) {
        var work = data.map(function (r) {
            return exports.populate(c, refs, maybe_1.just(r), fields)
                .map(function (m) { return m.get(); });
        });
        return future_1.batch(array_1.distribute(work, n))
            .map(function (r) { return r.reduce(function (p, c) { return p.concat(c); }, []); });
    }
    else {
        return future_1.pure(data);
    }
};
/**
 * createIndexes can be used to create multiple indexes on a collection on
 * version > 2.6
 */
exports.createIndexes = function (c, specs, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.createIndexes(specs, opts, cb);
    });
};
//# sourceMappingURL=collection.js.map