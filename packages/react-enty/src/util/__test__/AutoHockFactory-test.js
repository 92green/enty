//@flow
import PropChangeHock from '../PropChangeHoc';
import AutoHockFactory from '../AutoHockFactory';

jest.mock('../PropChangeHoc');
PropChangeHock.mockImplementation((_) => _);



test('will apply propChange hock if config.auto is truthy', () => {
    AutoHockFactory({name: 'foo', auto: false});
    expect(PropChangeHock).not.toBeCalled();

    AutoHockFactory({name: 'foo', auto: true});
    expect(PropChangeHock.mock.calls[0][0].paths).toEqual([]);

    AutoHockFactory({name: 'foo', auto: ['foo', 'bar']});
    expect(PropChangeHock.mock.calls[1][0].paths).toEqual(['foo', 'bar']);
});


test('onRequest will only fire if config.shouldComponentAutoRequest returns true', () => {
    const onRequest = jest.fn();
    const wontFire = AutoHockFactory({
        name: 'foo',
        auto: true,
        shouldComponentAutoRequest: () => false
    });
    const willFire = AutoHockFactory({
        name: 'foo',
        auto: true
    });

    willFire.onPropChange({foo: {onRequest}});
    wontFire.onPropChange({foo: {onRequest}});

    expect(onRequest).toBeCalledTimes(1);
});
