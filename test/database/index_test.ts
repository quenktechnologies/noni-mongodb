import { assert } from '@quenk/test/lib/assert';
import { toPromise, Future, attempt, pure } from '@quenk/noni/lib/control/monad/future';
import { doN, DoFn } from '@quenk/noni/lib/control/monad';
import { connect, disconnect } from '../../lib/client';
import {
    insertOne,
} from '../../lib/database/collection';
import { drop, collections } from '../../lib/database';

const URL = 'mongodb://localhost/safe-mongo-test';

describe('database', () => {

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

    describe('collections()', () => {

        it('provide a list of active collections', () =>
            toPromise(doN(<DoFn<undefined, Future<undefined>>>function*() {

                yield insertOne(db.collection('col1'), {});
                yield insertOne(db.collection('col2'), {});
                yield insertOne(db.collection('col3'), {});
                yield insertOne(db.collection('col4'), {});
                yield insertOne(db.collection('col5'), {});

                let list = yield collections(db);

                yield attempt(() => assert(list.length === 5).true);

                return pure(undefined);

            })))

    })
})
