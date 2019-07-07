import React from 'react';
import composeWith from'unmutable/composeWith';
import Message from 'enty-state/lib/data/Message';

import {fetchOnLoad} from './RequestSuite';
import {errorOnLoad} from './RequestSuite';
import {nothing} from './RequestSuite';
import {refetch} from './RequestSuite';
import {fetchOnPropChange} from './RequestSuite';
import {fetchOnCallback} from './RequestSuite';
import {fetchSeries} from './RequestSuite';
import {fetchParallel} from './RequestSuite';
import {foo} from './RequestSuite';
import {fooError} from './RequestSuite';
import {mountWithProvider} from './RequestSuite';
import {asyncUpdate} from './RequestSuite';


describe('config', () => {

    it('will return a function', () => {
        expect(typeof foo.requestHoc({name: 'foo'})).toBe('function');
    });

    describe('config.name and message', () => {

        test('will throw an error if config.name is not supplied', () => {
            expect(() => foo.requestHoc({})).toThrow('requestHoc must be given a name');
        });

        it('will memoise the creation of the message based on requestState and response', () => {
        });

        it('will give a Message to props.[name]', () => {
            expect.assertions(1);
            mountWithProvider(() => composeWith(
                foo.requestHoc({name: 'bar'}),
                (props) => {
                    expect(props.bar).toBeInstanceOf(Message);
                    return null;
                }
            ))
        });

    });

    describe('config.auto', () => {

        it('will fetch if any auto prop path changes', async () => {
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
                auto: ['foo', 'bar.baz'],
                payloadCreator: () => '!!!'
            }));


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

    });

    describe('config.shouldComponentAutoRequest', () => {

        it('will not request if shouldComponentAutoRequest returns false', () => {
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
                auto: true,
                shouldComponentAutoRequest: () => false
            }));

            expect(wrapper).not.toBeFetching();
            expect(wrapper).toBeEmpty();
        });

        it('will call shouldComponentAutoRequest with props', () => {
            let shouldComponentAutoRequest = jest.fn();
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
                auto: true,
                shouldComponentAutoRequest
            }), {foo: 'bar'});

            expect(shouldComponentAutoRequest).toHaveBeenCalledWith({foo: 'bar'});
        });

    });

    describe('config.payloadCreator', () => {

        test('config.payloadCreator will default to an identity if config.auto is falsy', async () => {
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
            }), {payload: '!!!'});

            wrapper.find('.onRequest').simulate('click');
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
			expect(wrapper).toBeSuccess({data: '!!!'});
        });

        test('config.payloadCreator will by default return an empty object if config.auto is truthy', async () => {
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
                auto: true
            }));
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
			expect(wrapper).toBeSuccess({data: 'foo'});
        });

        test('config.payloadCreator will create the payload', async () => {
            expect.hasAssertions();
            let wrapper = mountWithProvider(foo.requestHoc({
                name: 'message',
                auto: true,
                payloadCreator: () => 'blah!'
            }));
            expect(wrapper).toBeFetching();
            await asyncUpdate(wrapper);
            expect(wrapper).toBeSuccess({data: 'blah!'});
        });

    });

    describe('config.mapResponseToProps', () => {

        test('config.mapResponseToProps will spread the response onto the hocked components props', async () => {
            expect.hasAssertions();
            // set up hoc
            let withRequest = foo.requestHoc({
                auto: true,
                name: 'message',
                payloadCreator: () => 'mapResponseToProps!',
                mapResponseToProps: true
            });

            // mount with assertions
            let wrapper = mountWithProvider((ExpectsMessage) => withRequest(
                (props) => {
                    props.message.requestState
                        .emptyMap(() => expect(props.data).toBeUndefined())
                        .fetchingMap(() => expect(props.data).toBeUndefined())
                        .successMap(() => expect(props.data).toBe('mapResponseToProps!'))
                    return null;
                }
            ));

            // await the success state
            await asyncUpdate(wrapper);

        });

        test('config.mapResponseToProps can be used to set the response on prop', async () => {
            expect.hasAssertions();
            // set up hoc
            let withRequest = foo.requestHoc({
                auto: true,
                name: 'message',
                payloadCreator: () => 'mapResponseToProps!',
                mapResponseToProps: (response) => ({foo: response})
            });

            // mount with assertions
            let wrapper = mountWithProvider((ExpectsMessage) => withRequest(
                (props) => {
                    props.message.requestState
                        .emptyMap(() => expect(props.foo).toBeUndefined())
                        .fetchingMap(() => expect(props.foo).toBeUndefined())
                        .successMap(() => expect(props.foo).toEqual({data: 'mapResponseToProps!'}));
                    return null;
                }
            ));

            // await the success state
            await asyncUpdate(wrapper);
        });

        test('the response will not be mapped to props if config.mapResponseToProps is undefined', async () => {
            expect.hasAssertions();

            // set up hoc
            let withRequest = foo.requestHoc({
                auto: true,
                name: 'message',
                payloadCreator: () => 'mapResponseToProps!',
            });

            // mount with assertions
            let wrapper = mountWithProvider((ExpectsMessage) => withRequest(
                (props) => {
                    props.message.requestState
                        .emptyMap(() => expect(props.data).toBeUndefined())
                        .fetchingMap(() => expect(props.data).toBeUndefined())
                        .successMap(() => expect(props.data).toBeUndefined());
                    return null;
                }
            ));

            // await the success state
            await asyncUpdate(wrapper);
        });

    });

});


describe('usage', () => {

    it('can fetch on load', async () => {
        return fetchOnLoad(foo.requestHoc({
            name: 'message',
            payloadCreator: () => 'foo',
            auto: true
        }));
    });

    it('can catch rejected requests', async () => {
        return errorOnLoad(fooError.requestHoc({
            name: 'message',
            payloadCreator: () => 'foo',
            auto: true
        }));
    });

    it('can do nothing', async () => {
        return nothing(foo.requestHoc({
            name: 'message'
        }));
    });

    it('can refetch content', async () => {
        return refetch(foo.requestHoc({
            name: 'message'
        }));
    });

    it('can fetch if props change', async () => {
        return fetchOnPropChange(foo.requestHoc({
            name: 'message',
            payloadCreator: ({id}) => id,
            auto: ['id']
        }));
    });

    it('can fetch from a callback', async () => {
        return fetchOnCallback(foo.requestHoc({
            name: 'message'
        }));
    });

    it('can fetch multiples in series', async () => {
        return fetchSeries((ExpectsMessage) => {
            return composeWith(
                foo.requestHoc({name: 'aa'}),
                foo.requestHoc({name: 'bb'}),
                class Test extends React.Component {
                    componentDidMount() {
                        const {aa, bb} = this.props;
                        aa.onRequest('first').then(() => bb.onRequest('second'));
                    }
                    render() {
                        const {aa, bb} = this.props;
                        return <div>
                            <ExpectsMessage message={aa} />
                            <ExpectsMessage message={bb} />
                        </div>;
                    }
                }
            );
        });
    });

    it('can fetch multiples in parallel', async () => {
        return fetchParallel((ExpectsMessage) => {
            return composeWith(
                foo.requestHoc({name: 'aa', auto: true, payloadCreator: () => 'first'}),
                foo.requestHoc({name: 'bb', auto: true, payloadCreator: () => 'second'}),
                (props) => {
                    const {aa, bb} = props;
                    return <div>
                        <ExpectsMessage message={aa} />
                        <ExpectsMessage message={bb} />
                    </div>;
                }
            );
        });
    });

});
