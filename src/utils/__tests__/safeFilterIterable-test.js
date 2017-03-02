import test from 'ava';
import {Schema, arrayOf} from 'normalizr';
import {fromJS, List, Record, Map} from 'immutable';

import safeFilterIterable from '../safeFilterIterable';

var FooRecord = Record({
    bar: null,
    qux: null
});

var BarRecord = Record({
    __deleted: false,
    name: 'bar'
});


test('safeFilterIterable() will filter out objects/records that have the provided key', tt => {
    var foo = fromJS({
        other: {
            key: {
                __deleted: true
            },
            list: [
                1,2,3,4,5, {__deleted: true}
            ]
        },
        test: new FooRecord({
            bar: new BarRecord({__deleted: false}),
            qux: new BarRecord({__deleted: true})
        })
    });

    // var foo = Map({rad: Map({
    //     bar: Map({__deleted: false}),
    //     qux: Map({__deleted: true})
    // })});
    //

    var newState = foo.update(safeFilterIterable('__deleted'));

    tt.is(newState.getIn(['other', 'key']), undefined);
    tt.is(newState.getIn(['other', 'list', 5]), undefined);
    tt.is(newState.getIn(['test', 'qux']), null);
    tt.is(newState.getIn(['test', 'bar', 'name']), 'bar');
});
