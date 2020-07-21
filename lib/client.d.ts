import * as mongo from 'mongodb';
import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Client is an alias for MongoClient.
 */
export declare type Client = mongo.MongoClient;
/**
 * Options is an alias for MongoClientOptions.
 */
export declare type Options = mongo.MongoClientOptions;
/**
 * connect to a MongoDB database using the driver as client.
 */
export declare const connect: (url: string, opts?: Options) => Future<Client>;
/**
 * disconnect a client from its MongoDB database.
 */
export declare const disconnect: (c: Client) => Future<void>;
