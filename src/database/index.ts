import * as mongo from 'mongodb';
import { Future, fromCallback } from '@quenk/noni/lib/control/monad/future';

/**
 * Database is an alias for Db.
 */
export type Database = mongo.Db;

/**
 * drop the database reference supplied.
 */
export const drop = (db: Database): Future<void> =>
    fromCallback(cb => db.dropDatabase(cb))

/**
 * dropColllection from the database reference supplied.
 */
export const dropCollection = (db: Database, name: string): Future<boolean> =>
    fromCallback(cb => db.dropCollection(name, cb));

/**
 * createIndex can be used to create an indexes on a collection.
 */
export const createIndex = (
    c: Database,
    collection: string,
    specs: string | mongo.IndexSpecification,
    opts: object = {}) => fromCallback<object>(cb =>
        c.createIndex(collection, specs, opts, cb));
