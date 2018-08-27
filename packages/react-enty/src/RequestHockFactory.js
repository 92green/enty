//@flow
import type {ComponentType} from 'react';
import type {Element} from 'react';
import type {RequestHockConfigInput} from './util/definitions';
import type {RequestHockConfig} from './util/definitions';
import type {HockMeta} from './util/definitions';
import type {HockApplier} from './util/definitions';
import type {Hock} from './util/definitions';

import {ConnectFull} from './util/Connect';
import React from 'react';
import RequestStateSelector from './RequestStateSelector';
import ErrorSelector from './ErrorSelector';
import {RequestHockNoNameError} from './util/Error';
import AutoHockFactory from './util/AutoHockFactory';
import {selectEntityByResult} from './EntitySelector';
import Message from './data/Message';
import composeWith from 'unmutable/lib/util/composeWith';
import identity from 'unmutable/lib/identity';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import set from 'unmutable/lib/set';

/**
 * RequestHockFactory
 */
export default function RequestHockFactory(actionCreator: Function, hockMeta: HockMeta): Hock {

    /**
     * RequestHock
     *
     * @kind function
     */
    const RequestHock = pipe(
        prepareConfig,
        function (config: RequestHockConfig): HockApplier {

            /**
             * RequestHockApplier
             */
            function RequestHockApplier(Component: ComponentType<*>): ComponentType<*> {

                const {payloadCreator = () => ({})} = config;
                const {updateResultKey = identity()} = config;
                const {name} = config;
                const {mapResponseToProps} = config;

                if(!name) {
                    throw RequestHockNoNameError(hockMeta.requestActionName);
                }

                const RequestHock = composeWith(
                    (ComponentWithState) => class RequestHock extends React.Component<*, *> {
                        request: Function;
                        constructor(props: *) {
                            super(props);
                            this.state = {};

                            this.request = pipe(
                                payloadCreator,
                                (payload: *): Promise<*> => {
                                    const nextResultKey = updateResultKey(
                                        config.resultKey || hockMeta.generateResultKey(payload),
                                        props
                                    );
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
                            ...(mapResponseToProps(stateProps[name].response)),
                            [name]: new Message({
                                ...stateProps[name],
                                onRequest: dispatchProps[name].onRequest
                            })
                        }),
                        hockMeta
                    ),
                    AutoHockFactory(config),
                    Component
                );

                RequestHock.displayName = `RequestHock(${name})`;
                return RequestHock;
            }

            return RequestHockApplier;
        }
    );

    return RequestHock;
}

function prepareConfig(config: RequestHockConfigInput): RequestHockConfig {
    return pipeWith(
        config,
        set('mapResponseToProps', mapResponseToProps(config))
    );
}

function mapResponseToProps({name, ...config}: RequestHockConfigInput): (Object => Object) {
    if(config.mapResponseToProps === true) return identity();
    if(typeof config.mapResponseToProps === 'function') {
        return pipe(
            config.mapResponseToProps,
            newProps => {
                if(Object.keys(newProps).includes(name)) {
                    throw new Error(`mapResponseToProps attempted to overwrite ${name} prop`);
                }
                return newProps;
            }
        );
    }

    // eslint-disable-next-line no-unused-vars
    return (response) => ({});
}

