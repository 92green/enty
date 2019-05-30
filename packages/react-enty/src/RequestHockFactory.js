//@flow
import type {ComponentType} from 'react';
import type {Element} from 'react';
import type {RequestHockConfigInput} from './util/definitions';
import type {RequestHockConfig} from './util/definitions';
import type {HockMeta} from './util/definitions';
import type {HockApplier} from './util/definitions';
import type {Hock} from './util/definitions';

import Connect, {ConnectFull} from './util/Connect';
import React from 'react';
import memoize from 'lru-memoize';
import RequestStateSelector from 'enty-state/lib/RequestStateSelector';
import ErrorSelector from 'enty-state/lib/ErrorSelector';
import {RequestHockNoNameError} from './util/Error';
import {selectEntityByResult} from 'enty-state/lib/EntitySelector';
import Message from 'enty-state/lib/data/Message';
import composeWith from 'unmutable/lib/util/composeWith';
import identity from 'unmutable/lib/identity';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import getIn from 'unmutable/lib/getIn';
import equals from 'unmutable/lib/equals';

// @intent using nature of destructuing and unused vars to
// filter out redux props.
// eslint-disable-next-line no-unused-vars
const filterReduxProps = ({store, dispatch, storeSubscription, ...props}) => props;
const returnObject: (payload?: mixed) => Object = () => ({});
const returnTrue: (payload?: mixed) => boolean = () => true;

type State = {
    previousProps?: {},
    nextResultKey: ?string,
    resultKey: ?string
};

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
        // prepare the config
        config => pipeWith(
            config,
            set('mapResponseToProps', mapResponseToProps(config))
        ),
        function (config: RequestHockConfig): HockApplier {

            /**
             * RequestHockApplier
             */
            function RequestHockApplier(Component: ComponentType<*>): ComponentType<*> {

                const {updateResultKey = identity()} = config;
                const {mapPropsToPayload = identity()} = config;
                const {name} = config;
                const {optimistic = true} = config;
                const {mapResponseToProps} = config;

                // Auto Props
                const {shouldComponentAutoRequest = returnTrue} = config;
                const {auto = false} = config;
                const paths = typeof auto === 'boolean' ? [] : auto;
                const {payloadCreator = auto ? returnObject : identity()} = config;

                if(!name) {
                    throw RequestHockNoNameError(hockMeta.requestActionName);
                }

                const generateMemoedProps = memoize()((requestState, response) => ({
                    ...(mapResponseToProps(response)),
                    [name]: new Message({requestState, response})
                }));

                const RequestHock = composeWith(
                    // dummy connect so we have a dispatch function
                    Connect(() => ({}), hockMeta),

                    // prepare request function
                    // listen for prop changes
                    // and calculate the current and next responseKey
                    (ComponentWithState) => class RequestHock extends React.Component<Object, State> {

                        constructor(props) {
                            super(props);
                            this.state = {resultKey: null, nextResultKey: null};
                        }

                        static getDerivedStateFromProps(pollutedProps, state: State) {
                            let resultKeys = {};
                            const {dispatch} = pollutedProps;
                            const props = filterReduxProps(pollutedProps);
                            const getPath = (path) => getIn(path.split('.'));
                            const setPath = (path, value) => setIn(path.split('.'), value);

                            const propsHaveChanged = paths
                                .some((item: string): boolean => {
                                    const previous = getPath(item)(state.previousProps || {});
                                    const next = getPath(item)(props);
                                    return !equals(previous)(next);
                                });

                            if(auto) {
                                if((propsHaveChanged || !state.previousProps) && shouldComponentAutoRequest(props)) {
                                    const payload = payloadCreator(mapPropsToPayload(props));
                                    resultKeys = RequestHock.deriveResponseKey(props, payload, state.nextResultKey);
                                    RequestHock.request(dispatch, payload, resultKeys.nextResultKey);
                                }
                            }

                            return {
                                previousProps: paths.reduce((rr, path) => {
                                    return setPath(path, getPath(path)(props))(rr);
                                }, {}),
                                ...resultKeys
                            };

                        }

                        static deriveResponseKey(props, payload, existingResultKey): State {
                            return {
                                nextResultKey: updateResultKey(
                                    config.resultKey || hockMeta.generateResultKey(payload),
                                    props
                                ),
                                resultKey: existingResultKey
                            };
                        }

                        static request(dispatch: Function, payload, resultKey: any) {
                            return dispatch(actionCreator(payload, {resultKey}));
                        }

                        render(): Element<any> {
                            const newProps = {
                                ...this.props,
                                [name]: {
                                    ...this.state,
                                    onRequest: (data) => {
                                        const payload = payloadCreator(data);
                                        const props = filterReduxProps(this.props);
                                        const {dispatch} = this.props;
                                        const resultKeys = RequestHock.deriveResponseKey(props, payload, this.state.nextResultKey);
                                        this.setState(resultKeys);
                                        return RequestHock.request(dispatch, payload, resultKeys.nextResultKey);
                                    }
                                }
                            };
                            return <ComponentWithState {...newProps} />;
                        }
                    },
                    ConnectFull(
                        // Construct name from state
                        (state: *, ownProps: *): * => {
                            const props = filterReduxProps(ownProps);
                            const {resultKey} = props[name];
                            const {nextResultKey} = props[name];
                            const {onRequest} = props[name];
                            const requestState = RequestStateSelector(state, nextResultKey, hockMeta)
                                .errorMap(() => null);

                            const beforeSuccess = () => optimistic ? nextResultKey : resultKey;

                            const responseKey = requestState
                                .emptyMap(beforeSuccess)
                                .fetchingMap(beforeSuccess)
                                .refetchingMap(beforeSuccess)
                                .errorMap(() => nextResultKey)
                                .successMap(() => nextResultKey)
                                .value();

                            const response = selectEntityByResult(state, responseKey, hockMeta);

                            const memoedProps = generateMemoedProps(requestState, response);
                            memoedProps[name].resultKey = responseKey;
                            memoedProps[name].onRequest = onRequest;
                            memoedProps[name].requestError = ErrorSelector(state, nextResultKey, hockMeta);

                            return {...props, ...memoedProps};
                        },
                        null,
                        null,
                        hockMeta
                    ),
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

    return returnObject;
}

