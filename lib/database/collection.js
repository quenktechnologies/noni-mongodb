"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
 * findOne doument in a collection.
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
    return future_1.fromCallback(function (cb) { return c.find(qry, opts).toArray(cb); })
        .map(function (r) { return maybe_1.fromArray(r); });
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
 */
exports.updateOne = function (c, qry, changes, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.updateOne(qry, { $set: changes }, opts, cb);
    });
};
/**
 * deleteOne document in a collection.
 */
exports.deleteOne = function (c, qry, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) {
        return c.deleteOne(qry, opts, cb);
    });
};
/**
 * aggregate applies an aggregation pipeline to a collection
 */
exports.aggregate = function (c, p, opts) {
    if (opts === void 0) { opts = {}; }
    return future_1.fromCallback(function (cb) { return c.aggregate(p, opts, cb); })
        .chain(function (cursor) {
        return future_1.fromCallback(function (cb) { return cursor.toArray(cb); })
            .chain(function (data) { return future_1.fromCallback(function (cb) { return cursor.close(cb); })
            .map(function () { return maybe_1.fromArray(data); }); });
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
    var _a;
    //disable _id unless its set.
    fields._id = (fields._id === 1) ? 1 : 0;
    if (mData.isNothing())
        return future_1.pure(mData);
    var data = mData.get();
    return exports.findOne(c, (_a = {}, _a[ref[1]] = data[ref[0]], _a), { fields: fields })
        .chain(function (mr) {
        if (mr.isJust())
            data[ref[0]] = mr.get();
        else
            delete data[ref[0]];
        return future_1.pure(maybe_1.just(data));
    });
};
/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default.
 */
exports.populateN = function (c, refs, data, fields, n) {
    if (n === void 0) { n = 100; }
    if (data.isJust()) {
        var work = data.get().map(function (r) {
            return exports.populate(c, refs, maybe_1.just(r), fields)
                .map(function (m) { return m.get(); });
        });
        return future_1.batch(array_1.distribute(work, n))
            .map(function (r) { return maybe_1.fromArray(r.reduce(function (p, c) { return p.concat(c); }, [])); });
    }
    else {
        return future_1.pure(data);
    }
};
//# sourceMappingURL=collection.js.map