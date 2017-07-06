import RequestStateSelector from './RequestStateSelector';
import DistinctMemo from './utils/DistinctMemo';
import Connect from './utils/Connect';
import {fromJS} from 'immutable';
import React from 'react';


export default function EntityMutationHockFactory(actionCreator: Function, selectOptions: Object): Function {
    return function EntityMutationHock(queryCreator: Function, optionsOverride: Object): Function {

        const options = {
            onMutateProp: 'onMutate',
            ...optionsOverride
        };

        const distinctSuccessMap = new DistinctMemo((value, data) => value.successMap(() => data));


        const withState = Connect((state, props) => {
            const resultKey = options.resultKey || fromJS({hash: queryCreator(props)}).hashCode();

            return {
                requestState: distinctSuccessMap.value(RequestStateSelector(state, resultKey, selectOptions), state)
            };
        }, selectOptions);

        return function EntityMutationHockApplier(Component: React.Element<any>): React.Element<any> {
            class MutationHock extends React.Component {
                constructor(props) {
                    super(props);
                    this.updateMutation = this.updateMutation.bind(this);
                    this.updateMutation(props);
                }

                componentWillReceiveProps(nextProps) {
                    this.updateMutation(nextProps);
                }

                updateMutation(props) {
                    this.mutation = (payload) => props.dispatch(actionCreator(queryCreator(payload), options));
                }

                render() {
                    const props = {
                        ...this.props,
                        [options.onMutateProp]: this.mutation
                    };
                    return <Component {...props} />;
                }
            }

            MutationHock.displayName = `MutationHock(${options.resultKey || ''})`;

            return withState(MutationHock);
        };

    };
}
