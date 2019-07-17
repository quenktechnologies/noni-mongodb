import * as mongo from 'mongodb';
import {
    Future,
    fromCallback,
} from '@quenk/noni/lib/control/monad/future';

/**
 * Client is an alias for MongoClient.
 */
export type Client = mongo.MongoClient;

/**
 * Options is an alias for MongoClientOptions.
 */
export type Options = mongo.MongoClientOptions;

/**
 * connect to a MongoDB database using the driver as client.
 */
export const connect = (url: string, opts: Options = {}): Future<Client> =>
    fromCallback(cb => mongo.MongoClient.connect(url, opts, cb));

/**
 * disconnect a client from its MongoDB database.
 */
export const disconnect = (c: Client): Future<void> =>
    fromCallback(cb => c.close(false, cb));
