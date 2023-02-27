import * as mongo from 'mongodb';

import {
    Future,
    pure,
    batch,
    doFuture,
    liftP
} from '@quenk/noni/lib/control/monad/future';
import { Object } from '@quenk/noni/lib/data/jsonx';
import { distribute, empty } from '@quenk/noni/lib/data/array';
import {
    Maybe,
    nothing,
    just,
    fromNullable
} from '@quenk/noni/lib/data/maybe';
import { Type } from '@quenk/noni/lib/data/type';

export { Maybe }

/**
 * Collection alias.
 */
export type Collection = mongo.Collection;

/**
 * InsertOneResult type.
 */
export type InsertOneResult = mongo.InsertOneResult<{ _id: object }>;

/**
 * InsertResult type.
 */
export type InsertResult = mongo.InsertOneResult<{ _id: object }>;

/**
 * InsertManyResult type.
 */
export type InsertManyResult = mongo.InsertManyResult;

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
export type UpdateResult = mongo.UpdateResult;

/**
 * DeleteResult type.
 */
export type DeleteResult = mongo.DeleteResult;

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
    (col: Collection, doc: object, opts: object = {}): Future<InsertOneResult> =>
        liftP<InsertOneResult>(() => col.insertOne(doc, opts));

/**
 * insertMany documents into a collection.
 */
export const insertMany =
    (col: Collection, docs: object[], opts: object = {}): Future<InsertManyResult> =>
        liftP(() => col.insertMany(docs, opts));

/**
 * findOne document in a collection.
 */
export const findOne = <T extends object>(col: Collection, qry: object, opts: object = {})
    : Future<Maybe<T>> =>
    liftP(() => col.findOne(qry, opts))
        .map(r => fromNullable<T>(<T>r));

/**
 * find documents in a collection.
 */
export const find = <T>(col: Collection, qry: object, opts: object = {})
    : Future<T[]> => <Future<T[]>>liftP(() => col.find<Type>(qry, opts).toArray());

/**
 * findOneAndUpdate a document in a collection.
 */
export const findOneAndUpdate = <T>(
    col: Collection,
    filter: object,
    update: object,
    opts: object = {}): Future<Maybe<T>> => doFuture(function*() {

        let result = yield liftP(() =>
            col.findOneAndUpdate(filter, update, opts));

        return pure(result.ok ? fromNullable<T>(result.value) : nothing());

    });

/**
 * count the number of documents in a collection that match a query.
 */
export const count =
    (col: mongo.Collection, qry: object, opts: object = {}): Future<Count> =>
        liftP<number>(() => col.countDocuments(qry, opts));

/**
 * updateOne document in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update 
 * documents.
 */
export const updateOne = (
    col: Collection,
    qry: object,
    updateSpec: object,
    opts: object = {}): Future<UpdateResult> =>
    liftP<UpdateResult>(() => col.updateOne(qry, updateSpec, opts));

/**
 * updateMany documents in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update 
 * documents.
 */
export const updateMany = (
    col: Collection,
    qry: object,
    updateSpec: object,
    opts: object = {}): Future<UpdateResult> =>
    <Future<UpdateResult>>liftP(() => col.updateMany(qry, updateSpec, opts));

/**
 * deleteOne document in a collection.
 */
export const deleteOne = (
    col: mongo.Collection,
    qry: object,
    opts: object = {}): Future<DeleteResult> =>
    liftP<DeleteResult>(() => col.deleteOne(qry, opts));

/**
 * deleteMany documents in a collection.
 */
export const deleteMany = (
    col: mongo.Collection,
    qry: object,
    opts: object = {}): Future<DeleteResult> =>
    liftP<DeleteResult>(() => col.deleteMany(qry, opts));

/**
 * aggregate applies an aggregation pipeline to a collection
 */
export const aggregate = <T>(
    col: Collection,
    p: object[],
    opts: object = {}): Future<T[]> => doFuture(function*() {

        let cursor = col.aggregate(p, opts);

        let data = yield liftP(() => cursor.toArray());

        cursor.close();

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
        col: mongo.Collection,
        ref: LinkRef,
        mData: Maybe<T>,
        fields: object): Future<Maybe<T>> => {

        //disable _id unless its set.
        (<Object>fields)._id = ((<Object>fields)._id === 1) ? 1 : 0;

        if (mData.isNothing()) return pure(mData);

        let data = <Object>mData.get();

        if (Array.isArray(data[ref[0]])) {

            return find(col, { [ref[1]]: { $in: data[ref[0]] } },
                { projection: fields })
                .chain(mr => {

                    if (!empty(mr))
                        data[ref[0]] = <Object[]>mr;
                    else
                        data[ref[0]] = [];

                    return pure(just(<T>data));

                });

        } else {

            return findOne(col, { [ref[1]]: data[ref[0]] },
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
    col: mongo.Collection,
    refs: LinkRef,
    data: T[],
    fields: object,
    n = 100): Future<T[]> => {

    if (!empty(data)) {

        let work =
            data.map(r =>
                populate(col, refs, just(r), fields)
                    .map(m => m.get()));

        return batch(distribute(work, n))
            .map(r => r.reduce((p, col) => p.concat(col), []));

    } else {

        return pure(data);

    }

}

/**
 * createIndexes can be used to create multiple indexes on a collection on
 * version > 2.6
 */
export const createIndexes = (
    col: mongo.Collection,
    specs: mongo.IndexDescription[],
    opts: object = {}) => liftP<object>(() =>
        col.createIndexes(specs, opts));
