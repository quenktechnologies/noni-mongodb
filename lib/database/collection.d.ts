import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Object } from '@quenk/noni/lib/data/json';
import { Maybe } from '@quenk/noni/lib/data/maybe';
export { Maybe };
/**
 * Collection alias.
 */
export declare type Collection = mongo.Collection;
/**
 * InsertOneResult type.
 */
export declare type InsertOneResult = mongo.InsertOneWriteOpResult<object>;
/**
 * InsertResult type.
 */
export declare type InsertResult = mongo.InsertWriteOpResult<object>;
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
export declare type UpdateResult = mongo.UpdateWriteOpResult;
/**
 * DeleteResult type.
 */
export declare type DeleteResult = mongo.DeleteWriteOpResultObject;
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
 * insertOne document into a collection.
 */
export declare const insertOne: (c: mongo.Collection<any>, doc: object, opts?: object) => Future<mongo.InsertOneWriteOpResult<object>>;
/**
 * insertMany documents into a collection.
 */
export declare const insertMany: (c: mongo.Collection<any>, docs: object[], opts?: object) => Future<mongo.InsertWriteOpResult<object>>;
/**
 * findOne doument in a collection.
 */
export declare const findOne: <T>(c: mongo.Collection<any>, qry: object, opts?: object) => Future<Maybe<T>>;
/**
 * find documents in a collection.
 */
export declare const find: <T>(c: mongo.Collection<any>, qry: object, opts?: object) => Future<Maybe<T[]>>;
/**
 * findOneAndUpdate a document in a collection.
 */
export declare const findOneAndUpdate: <T>(c: mongo.Collection<any>, filter: object, update: object, opts?: object) => Future<Maybe<T>>;
/**
 * count the number of documents in a collection that match a query.
 */
export declare const count: (c: mongo.Collection<any>, qry: object, opts?: object) => Future<number>;
/**
 * updateOne document in a collection.
 */
export declare const updateOne: (c: mongo.Collection<any>, qry: object, changes: object, opts?: object) => Future<mongo.UpdateWriteOpResult>;
/**
 * deleteOne document in a collection.
 */
export declare const deleteOne: (c: mongo.Collection<any>, qry: object, opts?: object) => Future<mongo.DeleteWriteOpResultObject>;
/**
 * aggregate applies an aggregation pipeline to a collection
 */
export declare const aggregate: <T>(c: mongo.Collection<any>, p: object[], opts?: object) => Future<Maybe<T[]>>;
/**
 * populate is a helper function for "linking" data nested in a
 * document.
 *
 * It works by replacing the occurence of a target key with a document
 * in another collection using the target key's value as the _id reference.
 */
export declare const populate: <T extends Object>(c: mongo.Collection<any>, ref: [string, string], mData: Maybe<T>, fields: object) => Future<Maybe<T>>;
/**
 * populateN is like populate but works with multiple documents.
 *
 * It will apply populate for each document individually operating in batches
 * of 100 by default.
 */
export declare const populateN: <T extends Object>(c: mongo.Collection<any>, refs: [string, string], data: Maybe<T[]>, fields: object, n?: number) => Future<Maybe<T[]>>;
