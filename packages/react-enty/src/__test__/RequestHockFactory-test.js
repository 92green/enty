// @flow
import type {HockMeta} from '../util/definitions';

import React from 'react';
import identity from 'unmutable/lib/identity';

import RequestStateSelector from 'enty-state/lib/RequestStateSelector';
import {FetchingState} from 'enty-state/lib/data/RequestState';
import {EmptyState} from 'enty-state/lib/data/RequestState';
import {RefetchingState} from 'enty-state/lib/data/RequestState';
import {ErrorState} from 'enty-state/lib/data/RequestState';
import {SuccessState} from 'enty-state/lib/data/RequestState';
import Message from 'enty-state/lib/data/Message';
import ObjectSchema from 'enty/lib/ObjectSchema';
import EntitySchema from 'enty/lib/EntitySchema';

import {RequestHockNoNameError} from '../util/Error';
import RequestHockFactory from '../RequestHockFactory';

jest.mock('enty-state/lib/RequestStateSelector');

const resolve = (x) => () => Promise.resolve(x);

const STORE = {
    subscribe: () => {},
    dispatch: (aa) => aa,
    getState: () => ({
        entity: {
            _baseSchema: ObjectSchema({
                entity: ObjectSchema({}),
            }),
            _result: {
                fizz: 123123,
                foo: {
                    entity: {bar: 123}
                },
                DEFAULT_RESULT_KEY: {
                    entity: {bar: 123}
                }
            },
            _requestState: {
                foo: FetchingState()
            }
        }
    })
};

const hockMeta: HockMeta = {
    generateResultKey: props => `${props}-resultKey`,
    requestActionName: 'FooAction'
};

const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
const RequestHockApplier = RequestHock({name: 'foo'});

function runTest({
    dive = true,
    config = {},
    render = jest.fn(),
    actionCreator = jest.fn(),
    store = STORE,
    requestState = EmptyState(),
    hockMeta = {
        generateResultKey: props => `DEFAULT_RESULT_KEY`,
        requestActionName: 'FooAction'
    },
    props = {}
}: Object) {
    // $FlowFixMe - flow cant tell that this has been mocked
    RequestStateSelector.mockReturnValue(requestState);
    const RequestHock = RequestHockFactory(actionCreator, hockMeta);
    const RequestHockApplier = RequestHock(config);
    const Child = RequestHockApplier((props) => {
        render(props);
        return null;
    });
    let component = shallow(<Child store={store} {...props} />);

    if(dive) {
        component = component.dive().dive().dive();
    }

    return component;
}


beforeEach(() => {
    // $FlowFixMe - flow cant tell that this has been mocked
    RequestStateSelector.mockReset();
});



describe('hocking', () => {

    test('will return a function', () => {
        expect(typeof RequestHock).toBe('function');
    });

    test('hockApplier should be a function', () => {
        expect(typeof RequestHockApplier).toBe('function');
    });

});


describe('config.name and message', () => {

    test('will throw an error is config.name is not supplied', () => {
        expect(() => RequestHock({})(() => null))
            .toThrow(RequestHockNoNameError('FooAction'));
    });

    it('will memoise the creation of the message based on requestState and response', () => {
        let message;
        let component = runTest({
            dive: false,
            config: {name: 'foo', auto: true}
        }).dive()

        const first = component.dive().prop('foo');
        component.setState({nextResultKey: 'DEFAULT_RESULT_KEY'}).update();
        const second = component.dive().prop('foo');
        expect(first).toBe(second); // result key stayed the same
        component.setState({nextResultKey: 'bar'}).update();
        const third = component.dive().prop('foo');
        expect(second).not.toBe(third); // result key changed

        // $FlowFixMe
        RequestStateSelector.mockReturnValue(FetchingState());
        const fourth = component.dive().prop('foo');
        expect(third).not.toBe(fourth); // request state changed

    });

    it('will throw an error is config.name is not supplied', () => {
        expect(() => RequestHock({})(() => null))
            .toThrow(RequestHockNoNameError('FooAction'));
    });

    test('hocked component will be given and Message to props.[name]', () => {
        runTest({
            config: {name: 'foo'},
            render: (props) => expect(props.foo).toBeInstanceOf(Message)
        });
    });

    test('Message.onRequest will dispatch an action', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo'},
            render: (props) => props.foo.onRequest()
        });
        expect(actionCreator).toHaveBeenCalled();
    });

    test('will strip errors out of requestStates', () => {
        expect.assertions(1);
        runTest({
            requestState: ErrorState({message: 'error!'}),
            config: {name: 'foo'},
            render: (props) => props.foo.requestState.errorMap(data => {
                expect(data).toBe(null);
            })
        });
    });

});


describe('config.auto', () => {

    it('will dispatch if auto is truthy', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo', auto: true}
        });
        expect(actionCreator).toHaveBeenCalled();
    });

    it('will redispatch if an auto path changes', () => {
        const actionCreator = jest.fn();
        let component = runTest({
            dive: false,
            actionCreator,
            config: {name: 'foo', auto: ['bar']}
        });
        component = component.dive();
        expect(actionCreator).toHaveBeenCalledTimes(1);
        component.setProps({bar: 1});
        expect(actionCreator).toHaveBeenCalledTimes(2);
    });

});


describe('config.shouldComponentAutoRequest', () => {

    it('will not request if shouldComponentAutoRequest returns false', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo', auto: true, shouldComponentAutoRequest: () => false},
        });

        expect(actionCreator).not.toHaveBeenCalled();
    });

    it('will call shouldComponentAutoRequest with props', () => {
        const shouldComponentAutoRequest = jest.fn();
        runTest({
            config: {name: 'foo', auto: true, shouldComponentAutoRequest},
            props: {extra: 'PROP!'}
        });

        expect(shouldComponentAutoRequest.mock.calls[0][0].extra).toBe('PROP!');
    });

});


describe('config.payloadCreator', () => {

    test('config.payloadCreator will default to an identity if config.auto is falsy', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo'},
            render: props => props.foo.onRequest('bar')
        })
        expect(actionCreator).toHaveBeenCalledWith('bar', {resultKey: 'DEFAULT_RESULT_KEY'});
    });

    test('config.payloadCreator will by default return an empty object if config.auto is truthy', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {auto: true, name: 'foo'},
        })
        expect(actionCreator).toHaveBeenCalledWith({}, {resultKey: 'DEFAULT_RESULT_KEY'});
    });

    test('config.payloadCreator will create the payload', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {auto: true, name: 'foo', payloadCreator: () => 'bar'},
        })
        expect(actionCreator).toHaveBeenCalledWith('bar', {resultKey: 'DEFAULT_RESULT_KEY'});
    });

});


describe('config.updateResultKey', () => {

    test('config.updateResultKey will by default be an identity function', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo', auto: true}
        });
        expect(actionCreator).toHaveBeenCalledWith({}, {resultKey: 'DEFAULT_RESULT_KEY'});
    });

    test('config.updateResultKey will update the resultKey', () => {
        const actionCreator = jest.fn();
        runTest({
            actionCreator,
            config: {name: 'foo', updateResultKey: resultKey => `${resultKey}-bar`, auto: true}
        });

        expect(actionCreator).toHaveBeenCalledWith({}, {resultKey: 'DEFAULT_RESULT_KEY-bar'});
        expect(actionCreator).not.toHaveBeenCalledWith({}, {resultKey: 'DEFAULT_RESULT_KEY'});
    });

    test('config.updateResultKey is called with the resultKey and props', () => {
        const updateResultKey = jest.fn();
        runTest({
            config: {name: 'foo', updateResultKey, auto: true},
            props: {extraProp: 'bar'}
        });
        expect(updateResultKey).toHaveBeenCalledWith('DEFAULT_RESULT_KEY', {extraProp: 'bar'});
    });

});


describe('config.resultKey', () => {

    it('will override resultKey from config', () => {
        expect.assertions(1);
        runTest({
            config: {name: 'foo', resultKey: 'FOO', auto: true},
            render: (props) => expect(props.foo.resultKey).toBe('FOO')
        });
    });

});


describe('config.mapResponseToProps', () => {

    test('config.mapResponseToProps will spread the response onto the hocked components props', () => {
        expect.assertions(2);
        runTest({
            config: {name: 'foo', mapResponseToProps: true, auto: true},
            render: props => {
                expect(props.entity).toEqual(props.foo.response.entity);
                expect(props.entity).toEqual({bar: 123});
            }
        });
    });

    test('config.mapResponseToProps can be used to set the response on prop', () => {
        expect.assertions(2);
        runTest({
            config: {
                name: 'foo',
                mapResponseToProps: (response) => ({fizz: response}),
                auto: true
            },
            render: props => {
                expect(props.fizz.entity).toEqual(props.foo.response.entity);
                expect(props.fizz.entity).toEqual({bar: 123});
            }
        });
    });

    test('config.mapResponseToProps will throw an error if the new props will collide with the message prop', () => {
        expect(function () {
            runTest({
                config: {
                    name: 'foo',
                    mapResponseToProps: (response) => ({foo: response}),
                    auto: true
                }
            })
        }).toThrow();
    });

    test('the response will not be mapped to props if config.mapResponseToProps is undefined', () => {
        expect.assertions(1);
        runTest({
            config: {name: 'foo', auto: true},
            render: props => {
                expect(props.entity).toBe(undefined);
            }
        });
    });

});

describe('config.mapPropsToPayload', () => {

    it('will call mapPropsToPayload for auto requests', () => {
        const mapPropsToPayload = jest.fn(x => x.id);
        const payloadCreator = jest.fn();

        runTest({
            config: {name: 'foo', auto: true, mapPropsToPayload, payloadCreator},
            props: {id: '123'},
        });

        expect(mapPropsToPayload).toHaveBeenCalledWith({id: '123'});
        expect(payloadCreator).toHaveBeenCalledWith('123');
    });

    it('will not call mapPropsToPayload for message.onRequest', () => {
        const mapPropsToPayload = jest.fn(x => x.id);
        const payloadCreator = jest.fn();

        runTest({
            config: {name: 'foo', mapPropsToPayload, payloadCreator},
            props: {id: '123'},
            render: (props) => {
                props.foo.onRequest('Payload!');
            }
        });

        expect(mapPropsToPayload).not.toHaveBeenCalledWith({id: '123'});
        expect(payloadCreator).toHaveBeenCalledWith('Payload!');
    });

});


describe('config.optimistic', () => {

    it('will return existing results when empty or (re)fetching auto requests', () => {
        const run = (requestState, resultKey, match) => runTest({
            config: {name: 'foo', resultKey, auto: true},
            requestState,
            render: props => expect(props.foo.response).toEqual(match),
            store: {
                subscribe: () => {},
                dispatch: (aa) => aa,
                getState: () => ({
                    entity: {
                        _baseSchema: ObjectSchema({}),
                        _result: {
                            foo: {id: '123'}
                        }
                    }
                })
            }
        });

        run(EmptyState(), 'foo', {id: '123'});
        run(EmptyState(), 'bar', {});
        run(FetchingState(), 'foo', {id: '123'});
        run(FetchingState(), 'bar', {});
        run(RefetchingState(), 'foo', {id: '123'});
        run(RefetchingState(), 'bar', {});

    });

    it('will not return existing results when empty or (re)fetching auto requests', () => {
        const run = (requestState, resultKey, match) => runTest({
            config: {name: 'foo', resultKey},
            requestState,
            render: props => expect(props.foo.response).toEqual(match),
            store: {
                subscribe: () => {},
                dispatch: (aa) => aa,
                getState: () => ({
                    entity: {
                        _baseSchema: ObjectSchema({}),
                        _result: {
                            foo: {id: '123'}
                        }
                    }
                })
            }
        });

        run(EmptyState(), 'foo', {entity: undefined});
        run(EmptyState(), 'bar', {});
    });

    it('will select the next resultKey for empty/fetching/refetching if optimistic is true', () => {
        // set up is a bit hacky here.
        // we have to manually set the state as there is no other
        // entry point into the cycle
        expect.assertions(10);
        const actionCreator = jest.fn();
        const run = (optimistic, requestState, resultKey) => runTest({
            dive: false,
            requestState,
            config: {name: 'foo', optimistic, auto: true},
            render: (props) => expect(props.foo.resultKey).toBe(resultKey)
        }).dive().setState({resultKey: 'foo', nextResultKey: 'bar'}).dive().dive()

        run(false, EmptyState(), 'foo');
        run(false, FetchingState(), 'foo');
        run(false, RefetchingState(), 'foo');
        run(false, SuccessState(), 'bar');
        run(false, ErrorState(), 'bar');

        run(true, EmptyState(), 'bar');
        run(true, FetchingState(), 'bar');
        run(true, RefetchingState(), 'bar');
        run(true, SuccessState(), 'bar');
        run(true, ErrorState(), 'bar');

    });


});


