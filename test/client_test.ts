import { connect, disconnect } from '../lib/client';

let db: any;

describe('client', () => {

    describe('connect', () => {

        after(() => {

            disconnect(db);

        });

        it('should work', () => {

            db = connect('mongodb://localhost/safe-mongo-test');

        });

    });

});
