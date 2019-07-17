import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Database is an alias for Db.
 */
export declare type Database = mongo.Db;
/**
 * drop the database reference supplied.
 */
export declare const drop: (db: mongo.Db) => Future<void>;
/**
 * dropColllection from the database reference supplied.
 */
export declare const dropCollection: (db: mongo.Db, name: string) => Future<boolean>;
