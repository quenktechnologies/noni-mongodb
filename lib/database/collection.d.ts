import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Object } from '@quenk/noni/lib/data/jsonx';
import { Maybe } from '@quenk/noni/lib/data/maybe';
export { Maybe };
/**
 * Collection alias.
 */
export declare type Collection = mongo.Collection;
/**
 * InsertOneResult type.
 */
export declare type InsertOneResult = mongo.InsertOneResult<{
    _id: object;
}>;
/**
 * InsertResult type.
 */
export declare type InsertResult = mongo.InsertOneResult<{
    _id: object;
}>;
/**
 * InsertManyResult type.
 */
export declare type InsertManyResult = mongo.InsertManyResult;
/**
 * FindResult type.
 */
export declare type FindResult<T> = Maybe<T>;
/**
 * Count type.
 */
export declare type Count = number;
/**
 * UpdateResult type.
 */
export declare type UpdateResult = mongo.UpdateResult;
/**
 * DeleteResult type.
 */
export declare type DeleteResult = mongo.DeleteResult;
/**
 * LinkRef type used in population.
 */
export declare type LinkRef = [LocalKey, ForeignKey];
/**
 * LocalKey type.
 */
export declare type LocalKey = string;
/**
 * ForeignKey type.
 */
export declare type ForeignKey = string;
/**
 * AggregationCursor
 */
export declare type AggregationCursor<T> = mongo.AggregationCursor<T>;
/**
 * insertOne document into a collection.
 */
export declare const insertOne: (col: Collection, doc: object, opts?: object) => Future<InsertOneResult>;
/**
 * insertMany documents into a collection.
 */
export declare const insertMany: (col: Collection, docs: object[], opts?: object) => Future<InsertManyResult>;
/**
 * findOne document in a collection.
 */
export declare const findOne: <T>(col: Collection, qry: object, opts?: object) => Future<Maybe<T>>;
/**
 * find documents in a collection.
 */
export declare const find: <T>(col: Collection, qry: object, opts?: object) => Future<T[]>;
/**
 * findOneAndUpdate a document in a collection.
 */
export declare const findOneAndUpdate: <T>(col: Collection, filter: object, update: object, opts?: object) => Future<Maybe<T>>;
/**
 * count the number of documents in a collection that match a query.
 */
export declare const count: (col: mongo.Collection, qry: object, opts?: object) => Future<Count>;
/**
 * updateOne document in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
export declare const updateOne: (col: Collection, qry: object, updateSpec: object, opts?: object) => Future<UpdateResult>;
/**
 * updateMany documents in a collection.
 *
 * The updateSpec should correspond to any of the valid mongodb update
 * documents.
 */
export declare const updateMany: (col: Collection, qry: object, updateSpec: object, opts?: object) => Future<UpdateResult>;
/**
 * deleteOne document in a collection.
 */
export declare const deleteOne: (col: mongo.Collection, qry: object, opts?: object) => Future<DeleteResult>;
/**
 * deleteMany documents in a collection.
 */
export declare const deleteMany: (col: mongo.Collection, qry: object, opts?: object) => Future<DeleteResult>;
/**
 * aggregate applies an aggregation pipeline to a collection
 */
export declare const aggregate: <T>(col: Collection, p: object[], opts?: object) => Future<T[]>;
/**
 * populate is a helper function for "linking" data nested in a
 * document.
 *
 * It works by replacing the occurence of a target key with a document
 * in another collection using the target key's value as the _id reference.
 */
export declare const populate: <T extends Object>(col: mongo.Collection, ref: LinkRef, mData: Maybe<T>, fields: object) => Future<Maybe<T>>;
/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default.
 */
export declare const populateN: <T extends Object>(col: mongo.Collection, refs: LinkRef, data: T[], fields: object, n?: number) => Future<T[]>;
/**
 * createIndexes can be used to create multiple indexes on a collection on
 * version > 2.6
 */
export declare const createIndexes: (col: mongo.Collection, specs: mongo.IndexDescription[], opts?: object) => Future<object>;
