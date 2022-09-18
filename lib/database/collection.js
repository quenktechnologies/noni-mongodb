"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexes = exports.populateN = exports.populate = exports.aggregate = exports.deleteMany = exports.deleteOne = exports.updateMany = exports.updateOne = exports.count = exports.findOneAndUpdate = exports.find = exports.findOne = exports.insertMany = exports.insertOne = void 0;
const future_1 = require("@quenk/noni/lib/control/monad/future");
const array_1 = require("@quenk/noni/lib/data/array");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * insertOne document into a collection.
 */
const insertOne = (col, doc, opts = {}) => (0, future_1.fromCallback)(cb => col.insertOne(doc, opts, cb));
exports.insertOne = insertOne;
/**
 * insertMany documents into a collection.
 */
const insertMany = (col, docs, opts = {}) => (0, future_1.liftP)(() => col.insertMany(docs, opts));
exports.insertMany = insertMany;
/**
 * findOne document in a collection.
 */
const findOne = (col, qry, opts = {}) => (0, future_1.fromCallback)(cb => col.findOne(qry, opts, cb))
    .map(r => (0, maybe_1.fromNullable)(r));
exports.findOne = findOne;
/**
 * find documents in a collection.
 */
const find = (col, qry, opts = {}) => (0, future_1.liftP)(() => col.find(qry, opts).toArray());
exports.find = find;
/**
 * findOneAndUpdate a document in a collection.
 */
const findOneAndUpdate = (col, filter, update, opts = {}) => (0, future_1.doFuture)(function* () {
    let result = yield (0, future_1.liftP)(() => col.findOneAndUpdate(filter, update, opts));
    return (0, future_1.pure)(result.ok ? (0, maybe_1.fromNullable)(result.value) : (0, maybe_1.nothing)());
});
exports.findOneAndUpdate = findOneAndUpdate;
/**
 * count the number of documents in a collection that match a query.
 */
const count = (col, qry, opts = {}) => (0, future_1.fromCallback)(cb => col.countDocuments(qry, opts, cb));
exports.count = count;
/**
 * updateOne document in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
const updateOne = (col, qry, updateSpec, opts = {}) => (0, future_1.fromCallback)(cb => col.updateOne(qry, updateSpec, opts, cb));
exports.updateOne = updateOne;
/**
 * updateMany documents in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
const updateMany = (col, qry, updateSpec, opts = {}) => (0, future_1.liftP)(() => col.updateMany(qry, updateSpec, opts));
exports.updateMany = updateMany;
/**
 * deleteOne document in a collection.
 */
const deleteOne = (col, qry, opts = {}) => (0, future_1.fromCallback)(cb => col.deleteOne(qry, opts, cb));
exports.deleteOne = deleteOne;
/**
 * deleteMany documents in a collection.
 */
const deleteMany = (col, qry, opts = {}) => (0, future_1.fromCallback)(cb => col.deleteMany(qry, opts, cb));
exports.deleteMany = deleteMany;
/**
 * aggregate applies an aggregation pipeline to a collection
 */
const aggregate = (col, p, opts = {}) => (0, future_1.doFuture)(function* () {
    let cursor = col.aggregate(p, opts);
    let data = yield (0, future_1.liftP)(() => cursor.toArray());
    cursor.close();
    return (0, future_1.pure)(data);
});
exports.aggregate = aggregate;
/**
 * populate is a helper function for "linking" data nested in a
 * document.
 *
 * It works by replacing the occurence of a target key with a document
 * in another collection using the target key's value as the _id reference.
 */
const populate = (col, ref, mData, fields) => {
    //disable _id unless its set.
    fields._id = (fields._id === 1) ? 1 : 0;
    if (mData.isNothing())
        return (0, future_1.pure)(mData);
    let data = mData.get();
    if (Array.isArray(data[ref[0]])) {
        return (0, exports.find)(col, { [ref[1]]: { $in: data[ref[0]] } }, { projection: fields })
            .chain(mr => {
            if (!(0, array_1.empty)(mr))
                data[ref[0]] = mr;
            else
                data[ref[0]] = [];
            return (0, future_1.pure)((0, maybe_1.just)(data));
        });
    }
    else {
        return (0, exports.findOne)(col, { [ref[1]]: data[ref[0]] }, { projection: fields })
            .chain(mr => {
            if (mr.isJust())
                data[ref[0]] = mr.get();
            else
                delete data[ref[0]];
            return (0, future_1.pure)((0, maybe_1.just)(data));
        });
    }
};
exports.populate = populate;
/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default.
 */
const populateN = (col, refs, data, fields, n = 100) => {
    if (!(0, array_1.empty)(data)) {
        let work = data.map(r => (0, exports.populate)(col, refs, (0, maybe_1.just)(r), fields)
            .map(m => m.get()));
        return (0, future_1.batch)((0, array_1.distribute)(work, n))
            .map(r => r.reduce((p, col) => p.concat(col), []));
    }
    else {
        return (0, future_1.pure)(data);
    }
};
exports.populateN = populateN;
/**
 * createIndexes can be used to create multiple indexes on a collection on
 * version > 2.6
 */
const createIndexes = (col, specs, opts = {}) => (0, future_1.fromCallback)(cb => col.createIndexes(specs, opts, cb));
exports.createIndexes = createIndexes;
//# sourceMappingURL=collection.js.map