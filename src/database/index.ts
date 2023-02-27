import * as mongo from 'mongodb';

import { Future,  liftP } from '@quenk/noni/lib/control/monad/future';

/**
 * Database is an alias for Db.
 */
export type Database = mongo.Db;

/**
 * drop the database reference supplied.
 */
export const drop = (db: Database): Future<boolean> =>
    liftP(() => db.dropDatabase())

/**
 * dropColllection from the database reference supplied.
 */
export const dropCollection = (db: Database, name: string): Future<boolean> =>
    liftP(() => db.dropCollection(name));

/**
 * collections provides a list of collection instances for each collection in
 * the database.
 */
export const collections = (db: Database): Future<mongo.Collection[]> =>
    liftP(() => db.collections());

/**
 * createIndex can be used to create an indexes on a collection.
 */
export const createIndex = (
    db: mongo.Db,
    name: string,
    spec: mongo.IndexSpecification,
    opts: mongo.CreateIndexesOptions = {}) =>
    liftP(() => db.createIndex(name, spec, opts));
