//@flow
import type {ComponentType} from 'react';
import type {Element} from 'react';
import type {RequestHockConfig} from './util/definitions';
import type {HockMeta} from './util/definitions';

import {ConnectFull} from './util/Connect';
import React from 'react';
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';
import RequestStateSelector from './RequestStateSelector';
import ErrorSelector from './ErrorSelector';
import {RequestHockNoNameError} from './util/Error';
import {selectEntityByResult} from './EntitySelector';
import composeWith from 'unmutable/lib/util/composeWith';
import identity from 'unmutable/lib/identity';
import pipe from 'unmutable/lib/util/pipe';


/**
 * RequestHockFactory
 */
export default function RequestHockFactory(actionCreator: Function, hockMeta: HockMeta): Function {

    return function RequestHock(config: RequestHockConfig): Function {

        return function RequestHockApplier(Component: ComponentType<*>): ComponentType<*> {

            const {payloadCreator = () => {}} = config;
            const {updateResultKey = identity()} = config;
            const {name} = config;
            const {auto} = config;

            if(!name) {
                RequestHockNoNameError(hockMeta.requestActionName);
            }


            const RequestHock = composeWith(
                (ComponentWithState) => class RequestHock extends React.Component<*, *> {
                    updateRequest: Function;
                    request: (payload: *) => Promise<*>;
                    constructor(props: *) {
                        super(props);
                        this.state = {};
                        this.updateRequest();
                    }

                    componentWillReceiveProps() {
                        this.updateRequest();
                    }

                    updateRequest = () => {
                        this.request = pipe(
                            payloadCreator,
                            (payload: *): Promise<*> => {
                                const nextResultKey = updateResultKey(config.resultKey || hockMeta.generateResultKey(payload));
                                this.setState({
                                    nextResultKey,
                                    resultKey: this.state.nextResultKey
                                });
                                return actionCreator(payload, {resultKey: nextResultKey});
                            }
                        );
                    }

                    render(): Element<any> {
                        const props = {
                            ...this.props,
                            [name]: {
                                request: this.request,
                                nextResultKey: this.state.nextResultKey,
                                resultKey: this.state.resultKey
                            }
                        };
                        return <ComponentWithState {...props} />;
                    }
                },
                ConnectFull(
                    // Construct name from state
                    (state: *, props: *): * => {
                        const {resultKey} = props[name];
                        const {nextResultKey} = props[name];
                        const requestState = RequestStateSelector(state, nextResultKey, hockMeta);

                        const responseKey = requestState
                            .emptyMap(() => resultKey)
                            .fetchingMap(() => resultKey)
                            .refetchingMap(() => resultKey)
                            .errorMap(() => nextResultKey)
                            .successMap(() => nextResultKey)
                            .value();

                        return {
                            [name]: {
                                // @TODO rename resultKey to responseKey
                                resultKey: responseKey,
                                response: selectEntityByResult(state, responseKey, hockMeta),
                                requestState: RequestStateSelector(state, nextResultKey, hockMeta)
                                    // @TODO: temoporarily remove the error from the request state
                                    // once query hock and mutation hock are removed this can be taken out of the reduce
                                    // requestState variants shouldnt hold any data
                                    .errorMap(() => null),
                                requestError: ErrorSelector(state, nextResultKey, hockMeta)
                            }
                        };
                    },
                    // Construct dispatcher
                    (dispatch: *, props: *): * => {
                        const {request} = props[name];
                        return {
                            [name]: {
                                onRequest: (payload) => dispatch(request(payload))
                            }
                        };
                    },

                    // Merge State and dispatch
                    (stateProps, dispatchProps, ownProps) => ({
                        ...ownProps,
                        [name]: {
                            ...stateProps[name],
                            onRequest: dispatchProps[name].onRequest
                        }
                    }),
                    hockMeta
                ),

                // apply the prop change hock if auto is configured
                auto
                    ? PropChangeHock({
                        paths: typeof auto === 'boolean' ? [] : auto,
                        onPropChange: (props) => props[name].onRequest(props)
                    })
                    : identity(),
                Component
            );

            RequestHock.displayName = `RequestHock(${name})`;
            return RequestHock;
        };

    };
}

