import * as mongo from 'mongodb';
import {
    Future,
    pure,
    fromCallback,
    batch
} from '@quenk/noni/lib/control/monad/future';
import { Object } from '@quenk/noni/lib/data/json';
import { distribute } from '@quenk/noni/lib/data/array';
import {
    Maybe,
    nothing,
    just,
    fromNullable,
    fromArray
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
export type InsertOneResult = mongo.InsertOneWriteOpResult;

/**
 * InsertResult type.
 */
export type InsertResult = mongo.InsertWriteOpResult;

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
 * findOne doument in a collection.
 */
export const findOne = <T>(c: Collection, qry: object, opts: object = {})
    : Future<FindResult<T>> =>
    fromCallback<T | null | undefined>(cb => c.findOne(qry, opts, cb))
        .map(r => fromNullable<T>(<T>r));

/**
 * find documents in a collection.
 */
export const find = <T>(c: Collection, qry: object, opts: object = {})
    : Future<FindResult<T[]>> =>
    fromCallback<T[]>(cb => c.find(qry, opts).toArray(cb))
        .map(r => fromArray<T>(r));

/**
 * findOneAndUpdate a document in a collection.
 */
export const findOneAndUpdate =
    <T>(c: Collection,
        filter: object,
        update: object,
        opts: object = {}): Future<FindResult<T>> =>
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
 */
export const updateOne =
    (
        c: Collection,
        qry: object,
        changes: object,
        opts: object = {})
        : Future<UpdateResult> =>
        fromCallback<UpdateResult>(cb =>
            c.updateOne(qry, { $set: changes }, opts, cb));

/**
 * deleteOne document in a collection.
 */
export const deleteOne = (c: mongo.Collection, qry: object, opts: object = {})
    : Future<mongo.DeleteWriteOpResultObject> =>
    fromCallback<mongo.DeleteWriteOpResultObject>(cb =>
        c.deleteOne(qry, opts, cb));
/**
 * aggregate applies an aggregation pipeline to a collection
 */
export const aggregate = <T>(c: Collection, p: object[], opts: object = {})
    : Future<FindResult<T[]>> =>
    fromCallback<mongo.AggregationCursor<T>>(cb => c.aggregate(p, opts, cb))
        .chain(cursor =>
            fromCallback<T[]>(cb => cursor.toArray(cb))
                .chain(data => fromCallback<ACR>(cb => cursor.close(cb))
                    .map(() => fromArray(data))));

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

        let data = mData.get();

        return findOne(c, { [ref[1]]: data[ref[0]] }, { fields })
            .chain(mr => {

                if (mr.isJust())
                    data[ref[0]] = <Object>mr.get();

                return pure(just(data));

            });

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
    data: Maybe<T[]>,
    fields: object,
    n = 100): Future<Maybe<T[]>> => {

    if (data.isJust()) {

        let work =
            data.get().map(r =>
                populate(c, refs, just(r), fields)
                    .map(m => m.get()));

        return batch(distribute(work, n))
            .map(r => fromArray(r.reduce((p, c) => p.concat(c), [])));

    } else {

        return pure(data);

    }

}
