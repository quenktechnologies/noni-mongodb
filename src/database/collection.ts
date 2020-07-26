import * as mongo from 'mongodb';

import {
    Future,
    pure,
    fromCallback,
    batch,
    doFuture
} from '@quenk/noni/lib/control/monad/future';
import { Object } from '@quenk/noni/lib/data/json';
import { distribute, empty } from '@quenk/noni/lib/data/array';
import {
    Maybe,
    nothing,
    just,
    fromNullable
} from '@quenk/noni/lib/data/maybe';

export { Maybe }

type ACR = mongo.AggregationCursorResult;

/**
 * Collection alias.
 */
export type Collection = mongo.Collection;

/**
 * InsertOneResult type.
 */
export type InsertOneResult = mongo.InsertOneWriteOpResult<{ _id: object }>;

/**
 * InsertResult type.
 */
export type InsertResult = mongo.InsertWriteOpResult<{ _id: object }>;

/**
 * FindResult type.
 */
export type FindResult<T> = Maybe<T>;

/**
 * Count type.
 */
export type Count = number;

/**
 * UpdateResult type.
 */
export type UpdateResult = mongo.UpdateWriteOpResult;

/**
 * DeleteResult type.
 */
export type DeleteResult = mongo.DeleteWriteOpResultObject;

/**
 * LinkRef type used in population.
 */
export type LinkRef = [LocalKey, ForeignKey];

/**
 * LocalKey type.
 */
export type LocalKey = string;

/**
 * ForeignKey type.
 */
export type ForeignKey = string;

/**
 * AggregationCursor
 */
export type AggregationCursor<T> = mongo.AggregationCursor<T>;

/**
 * insertOne document into a collection.
 */
export const insertOne =
    (c: Collection, doc: object, opts: object = {}): Future<InsertOneResult> =>
        fromCallback<InsertOneResult>(cb => c.insertOne(doc, opts, cb));

/**
 * insertMany documents into a collection.
 */
export const insertMany =
    (c: Collection, docs: object[], opts: object = {}): Future<InsertResult> =>
        fromCallback<InsertResult>(cb => c.insertMany(docs, opts, cb));

/**
 * findOne document in a collection.
 */
export const findOne = <T>(c: Collection, qry: object, opts: object = {})
    : Future<Maybe<T>> =>
    fromCallback<T | null>(cb => c.findOne(qry, opts, cb))
        .map(r => fromNullable<T>(<T>r));

/**
 * find documents in a collection.
 */
export const find = <T>(c: Collection, qry: object, opts: object = {})
    : Future<T[]> =>
    fromCallback<T[]>(cb => c.find(qry, opts).toArray(cb))

/**
 * findOneAndUpdate a document in a collection.
 */
export const findOneAndUpdate = <T>(
    c: Collection,
    filter: object,
    update: object,
    opts: object = {}): Future<Maybe<T>> =>
    fromCallback<mongo.FindAndModifyWriteOpResultObject<T>>(cb =>
        c.findOneAndUpdate(filter, update, opts, cb))
        .map(r => r.ok ? fromNullable<T>(r.value) : nothing());

/**
 * count the number of documents in a collection that match a query.
 */
export const count =
    (c: mongo.Collection, qry: object, opts: object = {}): Future<Count> =>
        fromCallback<number>(cb => c.countDocuments(qry, opts, cb));

/**
 * updateOne document in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update 
 * documents.
 */
export const updateOne = (
    c: Collection,
    qry: object,
    updateSpec: object,
    opts: object = {}): Future<UpdateResult> =>
    fromCallback<UpdateResult>(cb => c.updateOne(qry, updateSpec, opts, cb));

/**
 * updateMany documents in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update 
 * documents.
 */
export const updateMany = (
    c: Collection,
    qry: object,
    updateSpec: object,
    opts: object = {}): Future<UpdateResult> =>
    fromCallback<UpdateResult>(cb => c.updateMany(qry, updateSpec, opts, cb));

/**
 * deleteOne document in a collection.
 */
export const deleteOne = (
    c: mongo.Collection,
    qry: object,
    opts: object = {}): Future<DeleteResult> =>
    fromCallback<DeleteResult>(cb => c.deleteOne(qry, opts, cb));

/**
 * deleteMany documents in a collection.
 */
export const deleteMany = (
    c: mongo.Collection,
    qry: object,
    opts: object = {}): Future<DeleteResult> =>
    fromCallback<DeleteResult>(cb => c.deleteMany(qry, opts, cb));

/**
 * aggregate applies an aggregation pipeline to a collection
 */
export const aggregate = <T>(
    c: Collection,
    p: object[],
    opts: object = {}): Future<T[]> => doFuture(function*() {

        let cursor = yield fromCallback(cb => c.aggregate(p, opts, cb));

        let data = yield fromCallback<T[]>(cb => cursor.toArray(cb));

        yield fromCallback<ACR>(cb => cursor.close(cb));

        return pure(data);

    });

/**
 * populate is a helper function for "linking" data nested in a 
 * document.
 *
 * It works by replacing the occurence of a target key with a document
 * in another collection using the target key's value as the _id reference.
 */
export const populate =
    <T extends Object>(
        c: mongo.Collection,
        ref: LinkRef,
        mData: Maybe<T>,
        fields: object): Future<Maybe<T>> => {

        //disable _id unless its set.
        (<Object>fields)._id = ((<Object>fields)._id === 1) ? 1 : 0;

        if (mData.isNothing()) return pure(mData);

        let data = <Object>mData.get();

        if (Array.isArray(data[ref[0]])) {

            return find(c, { [ref[1]]: { $in: data[ref[0]] } },
                { projection: fields })
                .chain(mr => {

                    if (!empty(mr))
                        data[ref[0]] = <Object[]>mr;
                    else
                        data[ref[0]] = [];

                    return pure(just(<T>data));

                });

        } else {

            return findOne(c, { [ref[1]]: data[ref[0]] }, 
              { projection: fields })
                .chain(mr => {

                    if (mr.isJust())
                        data[ref[0]] = <Object>mr.get();
                    else
                        delete data[ref[0]];

                    return pure(just(<T>data));

                });

        }

    }

/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default. 
 */
export const populateN = <T extends Object>(
    c: mongo.Collection,
    refs: LinkRef,
    data: T[],
    fields: object,
    n = 100): Future<T[]> => {

    if (!empty(data)) {

        let work =
            data.map(r =>
                populate(c, refs, just(r), fields)
                    .map(m => m.get()));

        return batch(distribute(work, n))
            .map(r => r.reduce((p, c) => p.concat(c), []));

    } else {

        return pure(data);

    }

}

/**
 * createIndexes can be used to create multiple indexes on a collection on
 * version > 2.6
 */
export const createIndexes = (
    c: mongo.Collection,
    specs: mongo.IndexSpecification[],
    opts: object = {}) => fromCallback<object>(cb =>
        c.createIndexes(specs, opts, cb));
