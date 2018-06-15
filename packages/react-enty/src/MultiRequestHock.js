//@flow
import type {ComponentType} from 'react';
import type {Element} from 'react';
import type {HockApplier} from './util/definitions';
import type {MultiRequestHockConfig} from './util/definitions';

import React from 'react';

import {RequestHockNoNameError} from './util/Error';
import AutoHockFactory from './util/AutoHockFactory';
import Message from './data/Message';
import composeWith from 'unmutable/lib/util/composeWith';


import {EmptyState} from './RequestState';
import {RefetchingState} from './RequestState';
import {FetchingState} from './RequestState';
import {SuccessState} from './RequestState';
import {ErrorState} from './RequestState';


type State = {
    fetched: boolean,
    message: Message
};

/**
 * MultiRequestHock
 *
 * @kind function
 */
export default function MultiRequestHock(config: MultiRequestHockConfig): HockApplier {

    /**
     * MultiRequestHockApplier
     */
    function MultiRequestHockApplier(Component: ComponentType<*>): ComponentType<*> {

        const {name} = config;

        if(!name) {
            throw RequestHockNoNameError('MultiRequestHock');
        }

        const MultiRequestHock = composeWith(
            (ComponentWithState) => class MultiRequestHock extends React.Component<*, State> {
                request: Function;
                constructor(props: *) {
                    super(props);
                    this.state = {
                        fetched: false,
                        message: new Message({
                            onRequest: this.onRequest,
                            response: null,
                            requestState: EmptyState(),
                            requestError: null
                        })
                    };
                }

                updateMessage = (fetched: boolean, payload: *) => {
                    this.setState({
                        fetched,
                        message: new Message({...this.state, ...payload})
                    });
                }

                onRequest = () => {
                    const requestState = this.state.fetched
                        ? RefetchingState()
                        : FetchingState()
                    ;

                    this.updateMessage(false, {requestState});
                    config
                        .onRequest(this.props)
                        .then(response => this.updateMessage(true, {
                            response,
                            requestState: SuccessState()
                        }))
                        .catch(requestError => this.updateMessage(false, {
                            requestError,
                            requestState: ErrorState()
                        }))
                    ;
                }

                render(): Element<any> {
                    const props = {
                        ...this.props,
                        [name]: this.state.message
                    };
                    return <ComponentWithState {...props} />;
                }
            },
            AutoHockFactory(config),
            Component
        );

        MultiRequestHock.displayName = `MultiRequestHock(${name})`;
        return MultiRequestHock;
    }

    return MultiRequestHockApplier;

}
