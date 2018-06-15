//@flow
//
import test from 'ava';
import {stub} from 'sinon';
const proxyquire = require('proxyquire').noCallThru();



test('will apply propChange hock if config.auto is truthy', t => {
    const PropChangeHock = stub().returns(config => config);
    const AutoHockFactory = proxyquire('../AutoHockFactory', {
        'stampy/lib/hock/PropChangeHock': PropChangeHock
    }).default;


    AutoHockFactory({auto: false});
    t.is(
        PropChangeHock.callCount,
        0,
        'will not call PropChangeHock if auto is false'
    );

    AutoHockFactory({auto: true});
    t.deepEqual(
        PropChangeHock.args[0][0]().paths,
        [],
        'will pass an empty array if auto is `true`'
    );

    AutoHockFactory({auto: ['foo', 'bar']});
    t.deepEqual(
        PropChangeHock.args[1][0]().paths,
        ['foo', 'bar'],
        'will pass auto to paths if it is not a boolean'
    );
});


test('onRequest will only fire if config.shouldComponentAutoRequest returns true', t => {
    const AutoHockFactory = proxyquire('../AutoHockFactory', {
        'stampy/lib/hock/PropChangeHock': xx => xx
    }).default;

    const wontFire = AutoHockFactory({
        name: 'foo',
        auto: true,
        shouldComponentAutoRequest: () => false
    });
    const willFire = AutoHockFactory({
        name: 'foo',
        auto: true,
        shouldComponentAutoRequest: () => true
    });

    willFire().onPropChange({foo: {onRequest: (props) => t.pass('this function should exceute')}});
    wontFire().onPropChange({foo: {onRequest: () => t.fail('this function should never exceute')}});
});
