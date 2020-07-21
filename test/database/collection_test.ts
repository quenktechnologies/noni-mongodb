import { assert } from '@quenk/test/lib/assert';
import { toPromise, Future, attempt, pure } from '@quenk/noni/lib/control/monad/future';
import { doN, DoFn } from '@quenk/noni/lib/control/monad';
import { connect, disconnect } from '../../lib/client';
import {
    insertOne,
    findOne,
    populate,
    insertMany,
    find,
    populateN,
} from '../../lib/database/collection';
import { drop } from '../../lib/database';

const URL = 'mongodb://localhost/safe-mongo-test';

describe('collection', () => {

    let mClient: any = null;

    let db: any = null;

    before(() => toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

        mClient = yield connect(URL);

        return pure(undefined);

    })));

    beforeEach(() => {

        db = mClient.db();

    });

    afterEach(() => toPromise(drop(db)));

    after(() => toPromise(disconnect(mClient)));

    describe('populate', () => {

        it('should populate a record', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                let sale = { id: 1000, client: 1, item: 'Shoes' };

                let client = { id: 1, name: 'Larry' };

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

                return pure(undefined);

            })))

        it('should populate an array', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                let sale0 = { id: 100, item: 'Shoes' };
                let sale1 = { id: 1000, item: 'Hands' };
                let sale2 = { id: 2000, item: 'Feet' };
                let sale3 = { id: 3000, item: 'Toes' };

                let client = { id: 1, name: 'Kule', sales: [100, 1000, 3000] };

                let sales = db.collection('sales');

                let clients = db.collection('clients');

                yield insertOne(sales, sale0);
                yield insertOne(sales, sale1);
                yield insertOne(sales, sale2);
                yield insertOne(sales, sale3);

                yield insertOne(clients, client);

                let mCli = yield findOne(clients, { id: 1 });

                let mPopClient = yield populate(sales, ['sales', 'id'], mCli,
                    { id: 1, item: 1 });

                let target = yield attempt(() => mPopClient.get());

                delete target._id;

                yield attempt(() => assert(target).equate({

                    id: 1,

                    name: 'Kule',

                    sales: [

                        { id: 100, item: 'Shoes' },
                        { id: 1000, item: 'Hands' },
                        { id: 3000, item: 'Toes' }

                    ]

                }));

                return pure(undefined);

            })))


    });

    describe('populateN', () => {

        it('should populate a record', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                let sale0 = { id: 1000, client: 1, item: 'Shoes' };

                let sale1 = { id: 2000, client: 2, item: 'Clothes' };

                let sale2 = { id: 1001, client: 3, item: 'Screws' };

                let sale3 = { id: 100, client: 2, item: 'Eggs' };

                let client0 = { id: 1, name: 'Larry' };

                let client1 = { id: 2, name: 'Harry' };

                let client2 = { id: 3, name: 'Barry' };

                let db = mClient.db();

                let sales = db.collection('sales');

                let clients = db.collection('clients');

                yield insertMany(sales, [sale0, sale1, sale2, sale3]);

                yield insertMany(clients, [client0, client1, client2]);

                let mSales = yield find(sales, {});

                let mPopSales =
                    yield populateN(clients, ['client', 'id'], mSales,
                      { id: 1, name: 1 });

                let targets = mPopSales;

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

                return pure(undefined);

            })))
    })
})
