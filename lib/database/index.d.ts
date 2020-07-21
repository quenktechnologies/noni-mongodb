import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Database is an alias for Db.
 */
export declare type Database = mongo.Db;
/**
 * drop the database reference supplied.
 */
export declare const drop: (db: Database) => Future<void>;
/**
 * dropColllection from the database reference supplied.
 */
export declare const dropCollection: (db: Database, name: string) => Future<boolean>;
/**
 * createIndex can be used to create an indexes on a collection.
 */
export declare const createIndex: (c: Database, collection: string, specs: string | object, opts?: object) => Future<object>;
