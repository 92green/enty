import React, {useEffect} from 'react';
import {Message} from 'enty-state';
import requestHoc from '../RequestHoc';

import {fetchOnLoad} from './RequestSuite';
import {errorOnLoad} from './RequestSuite';
import {nothing} from './RequestSuite';
import {refetch} from './RequestSuite';
import {exisitingKey} from './RequestSuite';
import {fetchOnPropChange} from './RequestSuite';
import {fetchOnCallback} from './RequestSuite';
import {fetchSeries} from './RequestSuite';
import {fetchParallel} from './RequestSuite';
import {foo} from './RequestSuite';
import {baz} from './RequestSuite';
import {fooError} from './RequestSuite';
import {mountWithProvider} from './RequestSuite';
import {asyncUpdate} from './RequestSuite';

describe('config', () => {
    describe('config.name and message', () => {
        test('will throw an error if config.name is not supplied', () => {
            // @ts-ignore
            expect(() => requestHoc({request: foo})).toThrow('requestHoc must be given a name');
        });

        test('will throw an error if config.key is not supplied', () => {
            // @ts-ignore
            expect(() => requestHoc({request: foo, name: 'foo'})).toThrow(
                'requestHoc must be given a key'
            );
        });

        test('will throw an error if config.request is not supplied', () => {
            // @ts-ignore
            expect(() => requestHoc({key: () => 'foo', name: 'foo'})).toThrow(
                'requestHoc must be given a request'
            );
        });

        it('will give a Message to props.[name]', () => {
            expect.assertions(1);
            mountWithProvider(() =>
                requestHoc({request: foo, name: 'bar', key: () => 'foo'})(
                    (props: {bar: Message}) => {
                        expect(props.bar).toBeInstanceOf(Message);
                        return null;
                    }
                )
            );
        });
    });

    describe('config.auto', () => {
        it('will fetch if any auto prop path changes', async () => {
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'config.auto.path',
                    name: 'message',
                    auto: ['foo', 'bar.baz'],
                    payloadCreator: () => '!!!'
                })
            );

            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});

            // props.foo
            wrapper.setProps({foo: '!'}).update();
            expect(wrapper).toBeRefetching({data: '!!!'});
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});

            // props.bar.baz
            wrapper.setProps({bar: {baz: '!'}}).update();
            expect(wrapper).toBeRefetching({data: '!!!'});
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});
        });

        it('will do deep checks and not update', async () => {
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'config.auto.deepChecks',
                    name: 'message',
                    auto: ['foo', 'bar'],
                    payloadCreator: () => '!!!'
                })
            );

            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});

            // props.foo
            wrapper.setProps({foo: '!'}).update();
            expect(wrapper).toBeRefetching({data: '!!!'});
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});

            // props.bar.baz
            wrapper.setProps({bar: {baz: '!'}}).update();
            expect(wrapper).toBeRefetching({data: '!!!'});
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});

            // props.bar.baz
            wrapper.setProps({bar: {baz: '!'}}).update();
            expect(wrapper).toBeSuccess({data: '!!!'});
        });
    });

    describe('config.shouldComponentAutoRequest', () => {
        it('will not request if shouldComponentAutoRequest returns false', () => {
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'notShoulComponentAutoRequest',
                    name: 'message',
                    auto: true,
                    shouldComponentAutoRequest: () => false
                })
            );

            expect(wrapper).not.toBeFetching();
            expect(wrapper).toBeEmpty();
        });

        it('will call shouldComponentAutoRequest with props', () => {
            let shouldComponentAutoRequest = jest.fn();
            mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'shouldComponentAutoRequestProps',
                    name: 'message',
                    auto: true,
                    shouldComponentAutoRequest
                }),
                {foo: 'bar'}
            );

            expect(shouldComponentAutoRequest).toHaveBeenCalledWith({
                foo: 'bar'
            });
        });
    });

    describe('config.payloadCreator', () => {
        test('config.payloadCreator will default to an identity if config.auto is falsy', async () => {
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'identity',
                    name: 'message'
                }),
                {payload: '!!!'}
            );

            wrapper.find('.request').simulate('click');
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: '!!!'});
        });

        test('config.payloadCreator will by default return an empty object if config.auto is truthy', async () => {
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'defaultEmptyObject',
                    name: 'message',
                    auto: true
                })
            );
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: 'foo'});
        });

        test('config.payloadCreator will create the payload', async () => {
            expect.hasAssertions();
            let wrapper = mountWithProvider(
                requestHoc({
                    request: foo,
                    key: () => 'payloadCreator',
                    name: 'message',
                    auto: true,
                    payloadCreator: () => 'blah!'
                })
            );
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: 'blah!'});
        });

        it('will pass .request() payload through payloadCreator', async () => {
            const payloadCreator = jest.fn();
            await fetchOnCallback(
                requestHoc({
                    request: foo,
                    key: () => 'pass request',
                    name: 'message',
                    payloadCreator
                })
            );
            expect(payloadCreator).toHaveBeenCalled();
        });
    });
});

describe('usage', () => {
    it('can fetch on load', async () => {
        return fetchOnLoad(
            requestHoc({
                request: foo,
                key: () => 'fetchOnLoad',
                name: 'message',
                payloadCreator: () => 'foo',
                auto: true
            })
        );
    });

    it('can catch rejected requests', async () => {
        return errorOnLoad(
            requestHoc({
                request: fooError,
                key: () => 'errorOnLoadfoo',
                name: 'message',
                payloadCreator: () => 'foo',
                auto: true
            })
        );
    });

    it('can do nothing', async () => {
        return nothing(
            requestHoc({
                request: foo,
                key: () => 'nothingfoo',
                name: 'message'
            })
        );
    });

    it('can refetch content', async () => {
        return refetch(
            requestHoc({
                request: foo,
                key: () => 'refetchfoo',
                name: 'message'
            })
        );
    });

    it('can use an exising key', async () => {
        return exisitingKey(
            requestHoc({
                request: baz,
                name: 'message',
                key: (props) => {
                    expect(props).toEqual({});
                    return 'initial-baz';
                }
            })
        );
    });

    it('can fetch if props change', async () => {
        return fetchOnPropChange(
            requestHoc({
                request: foo,
                key: ({id}) => 'propChangeHoc' + id,
                payloadCreator: (x) => x.id,
                name: 'message',
                auto: ['id']
            })
        );
    });

    it('can fetch from a callback', async () => {
        return fetchOnCallback(
            requestHoc({
                request: foo,
                key: () => 'callback',
                payloadCreator: () => 'foo',
                name: 'message'
            })
        );
    });

    it('can fetch multiples in series', async () => {
        return fetchSeries((ExpectsMessage) => {
            const aa = requestHoc({name: 'aa', request: foo, key: () => 'seriesaa'});
            const bb = requestHoc({name: 'bb', request: foo, key: () => 'seriesbb'});
            return bb(
                aa((props) => {
                    const {aa, bb} = props;

                    useEffect(() => {
                        if (aa.isEmpty) {
                            aa.request('first');
                        }
                        if (aa.isSuccess) {
                            bb.request('second');
                        }
                    }, [aa.requestState]);

                    return (
                        <div>
                            <ExpectsMessage message={aa} />
                            <ExpectsMessage message={bb} />
                        </div>
                    );
                })
            );
        });
    });

    it('can fetch multiples in parallel', async () => {
        return fetchParallel((ExpectsMessage) => {
            const aa = requestHoc({
                request: foo,
                key: () => 'parallelfoo',
                name: 'aa',
                payloadCreator: () => 'first',
                auto: true
            });
            const bb = requestHoc({
                request: foo,
                key: () => 'parallelbar',
                name: 'bb',
                payloadCreator: () => 'second',
                auto: true
            });
            return bb(
                aa((props) => {
                    const {aa, bb} = props;
                    return (
                        <div>
                            <ExpectsMessage message={aa} />
                            <ExpectsMessage message={bb} />
                        </div>
                    );
                })
            );
        });
    });
});
