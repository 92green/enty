//@flow
import RequestStateSelector from './RequestStateSelector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import Connect from './utils/Connect';
import {fromJS} from 'immutable';
import React from 'react';



/**
 * woot
 * @module Factories
 */


/**
 * EntityMutationHockFactory
 *
 * @param {function} actionCreator
 * @param {SelectOptions} selectOptions
 * @returns {MutationHock}
 * @memberof module:Factories
 */
export default function EntityMutationHockFactory(actionCreator: Function, selectOptions: SelectOptions): Function {

    /**
     * Mutation is used to request or change data in response to user interaction.
     * When the `onMutate` functions is called the payload is passed through `payloadCreator` and
     * on to its corresponding promise in the EntityApi.
     * The result of this promise is sent to the entity reducer along with a hash of `payloadCreator` as a `resultKey`.
     * The data is normalized, stored in state and then returned to the component. At each stage of the [entity flow]
     * An appropriate `RequestState` is given to the component. This means the component can be sure that the query is
     * fetching/re-fetching, has thrown an error, or has arrived safely.
     *
     * @example
     *
     * // UserDataHocks.js
     * import {UserMutationHock} from './EntityApi';
     * import DeleteUserQuery from './DeleteUserQuery.graphql';
     *
     * export function DeleteUserMutationHock() {
     *    return UserMutationHock(({id}) => {
     *        return {
     *            query: DeleteUserQuery,
     *            variables: {
     *                id
     *            }
     *        }
     *    });
     * }
     *
     * // User.jsx
     * import React from 'react';
     * import {DeleteUserMutationHock} from './UserDataHocks';
     *
     * function User(props) {
     *     const {id, onMutate} = props;
     *     return <Button onClick={() => onMutate(id)}>Delete User</Button>
     * }
     *
     * const withMutation = DeleteUserMutationHock();
     *
     * export default withMutation(User);
     *
     * @name MutationHock
     * @kind function
     * @param {function} payloadCreator - turns
     * @param {Object} [optionsOverride] - description
     * @returns {function}
     * @memberof module:Hocks
     */
    return function EntityMutationHock(payloadCreator: Function = aa => aa, optionsOverride: Object): Function {

        const options = {
            onMutateProp: 'onMutate',
            mutationRequestStateProp: 'mutationRequestState',
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
