import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Database is an alias for Db.
 */
export declare type Database = mongo.Db;
/**
 * drop the database reference supplied.
 */
export declare const drop: (db: Database) => Future<boolean>;
/**
 * dropColllection from the database reference supplied.
 */
export declare const dropCollection: (db: Database, name: string) => Future<boolean>;
/**
 * collections provides a list of collection instances for each collection in
 * the database.
 */
export declare const collections: (db: Database) => Future<mongo.Collection[]>;
/**
 * createIndex can be used to create an indexes on a collection.
 */
export declare const createIndex: (db: mongo.Db, name: string, spec: mongo.IndexSpecification, opts?: mongo.CreateIndexesOptions) => Future<string>;
