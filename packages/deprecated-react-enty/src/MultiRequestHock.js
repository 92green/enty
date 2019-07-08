//@flow
import type {ComponentType} from 'react';
import type {Element} from 'react';
import type {HockApplier} from './util/definitions';
import type {MultiRequestHockConfig} from './util/definitions';

import React from 'react';
import composeWith from 'unmutable/lib/util/composeWith';

import {RequestHockNoNameError} from './util/Error';
import PropChangeHoc from './util/PropChangeHoc';
import Message from 'enty-state/lib/data/Message';
import {EmptyState} from 'enty-state/lib/data/RequestState';
import {RefetchingState} from 'enty-state/lib/data/RequestState';
import {FetchingState} from 'enty-state/lib/data/RequestState';
import {SuccessState} from 'enty-state/lib/data/RequestState';
import {ErrorState} from 'enty-state/lib/data/RequestState';


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
                        message: new Message({...this.state.message, ...payload})
                    });
                }

                onRequest = (): Promise<*> => {
                    const requestState = this.state.fetched
                        ? RefetchingState()
                        : FetchingState()
                    ;

                    this.updateMessage(false, {requestState});
                    return config
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
            PropChangeHoc({
                ...config,
                onPropChange: props => props[name].onRequest(props)
            }),
            Component
        );

        MultiRequestHock.displayName = `MultiRequestHock(${name})`;
        return MultiRequestHock;
    }

    return MultiRequestHockApplier;

}
