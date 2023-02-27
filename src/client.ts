import * as mongo from 'mongodb';
import {
    Future,
    liftP
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
    liftP(() => mongo.MongoClient.connect(url, opts));

/**
 * disconnect a client from its MongoDB database.
 */
export const disconnect = (c: Client): Future<void> =>
    liftP(() => c.close(false));
