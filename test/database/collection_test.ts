import { assert } from '@quenk/test/lib/assert';
import { toPromise, Future, attempt } from '@quenk/noni/lib/control/monad/future';
import { doN, DoFn } from '@quenk/noni/lib/control/monad';
import { connect, disconnect } from '../../lib/client';
import { drop } from '../../lib/database';
import { insertOne, findOne, populate, insertMany, find, populateN } from '../../lib/database/collection';

const URL = 'mongodb://localhost/safe-mongo-test';

describe('collection', () => {

    describe('populate', () => {

        let mClient: any = null;

        after(() => toPromise(disconnect(mClient)));

        it('should populate a record', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                let sale = { id: 1000, client: 1, item: 'Shoes' };

                let client = { id: 1, name: 'Larry' };

                mClient = yield connect(URL);

                let db = mClient.db();

                let sales = db.collection('sales');

                let clients = db.collection('clients');

                yield insertOne(sales, sale);

                yield insertOne(clients, client);

                let mSale = yield findOne(sales, { id: 1000 });

                let mPopSale =
                    yield populate(clients, ['client', 'id'], mSale, { id: 1, name: 1 });

                let target = yield attempt(() => mPopSale.get());

                delete target._id;

                yield attempt(() => assert(target).equate({

                    id: 1000,

                    client: { id: 1, name: 'Larry' },

                    item: 'Shoes'

                }));

                return drop(db);

            })))

    });

    describe('populateN', () => {

        let mClient: any = null;

        after(() => toPromise(disconnect(mClient)));

        it('should populate a record', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                let sale0 = { id: 1000, client: 1, item: 'Shoes' };

                let sale1 = { id: 2000, client: 2, item: 'Clothes' };

                let sale2 = { id: 1001, client: 3, item: 'Screws' };

                let sale3 = { id: 100, client: 2, item: 'Eggs' };

                let client0 = { id: 1, name: 'Larry' };

                let client1 = { id: 2, name: 'Harry' };

                let client2 = { id: 3, name: 'Barry' };

                mClient = yield connect(URL);

                let db = mClient.db();

                let sales = db.collection('sales');

                let clients = db.collection('clients');

                yield insertMany(sales, [sale0, sale1, sale2, sale3]);

                yield insertMany(clients, [client0, client1, client2]);

                let mSales = yield find(sales, {});

                let mPopSales =
                    yield populateN(clients, ['client', 'id'], mSales, { id: 1, name: 1 });

                let targets = yield attempt(() => mPopSales.get());

                targets.forEach((t: { _id: string }) => delete t._id);

                yield attempt(() => assert(targets[0]).equate({

                    id: 1000,

                    client: { id: 1, name: 'Larry' },

                    item: 'Shoes'

                }));

                yield attempt(() => assert(targets[1]).equate({

                    id: 2000,

                    client: { id: 2, name: 'Harry' },

                    item: 'Clothes'

                }));

                yield attempt(() => assert(targets[2]).equate({

                    id: 1001,

                    client: { id: 3, name: 'Barry' },

                    item: 'Screws'

                }));

                yield attempt(() => assert(targets[3]).equate({

                    id: 100,

                    client: { id: 2, name: 'Harry' },

                    item: 'Eggs'

                }));

                return drop(db);

            })))

    })

})

