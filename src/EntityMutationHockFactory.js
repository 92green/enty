//@flow
import RequestStateSelector from './RequestStateSelector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import Connect from './utils/Connect';
import {fromJS} from 'immutable';
import React from 'react';

/**
 * @module Misc
 */

/**
 * Entitiy Mutation Hock
 *
 * param {function} sideEffect
 * returns {EntityQueryHockFactory}
 * @memberof module:Misc
 */
export default function EntityMutationHockFactory(actionCreator: Function, selectOptions: Object): Function {
    return function EntityMutationHock(payloadCreator: Function = aa => aa, optionsOverride: Object): Function {

        const options = {
            onMutateProp: 'onMutate',
            requestStateProp: 'requestState',
            ...optionsOverride
        };

        const distinctSuccessMap = new DistinctMemo((value, data) => value.successMap(() => data));

        return function EntityMutationHockApplier(Component: React.Element<any>): React.Element<any> {

            const blankConnect = Connect();
            const ComponentWithState = Connect((state: Object, props: Object): Object => {
                const data = selectEntityByResult(state, props.resultKey, selectOptions);
                return {
                    ...data,
                    [options.requestStateProp]: distinctSuccessMap.value(RequestStateSelector(state, props.resultKey, selectOptions), data)
                };
            }, selectOptions)(Component);

            class MutationHock extends React.Component {
                updateMutation: Function;
                mutation: Function;
                state: Object;
                constructor(props: Object) {
                    super(props);
                    this.state = {};
                    this.updateMutation = this.updateMutation.bind(this);
                    this.updateMutation(props);
                }

                componentWillReceiveProps(nextProps: Object) {
                    this.updateMutation(nextProps);
                }

                updateMutation(props: Object) {
                    this.mutation = (data: Object) => {
                        const payload = payloadCreator(data);
                        const resultKey = options.resultKey || fromJS({hash: payload}).hashCode();

                        this.setState({resultKey});

                        props.dispatch(actionCreator(payload, {
                            ...options,
                            resultKey
                        }));
                    };
                }

                render(): React.Element<any> {
                    const props = {
                        ...this.props,
                        resultKey: this.state.resultKey,
                        [options.onMutateProp]: this.mutation
                    };
                    return <ComponentWithState {...props} />;
                }
            }

            MutationHock.displayName = `MutationHock(${options.resultKey || ''})`;

            return blankConnect(MutationHock);
        };

    };
}
