// @flow
import type {Node} from 'react';

import React from 'react';
import getIn from 'unmutable/lib/getIn';
import equals from 'unmutable/lib/equals';
import identity from 'unmutable/lib/identity';

type Config = {
    auto?: boolean|Array<string>,
    shouldComponentAutoRequest?: (props: *) => boolean,
    onPropChange: Function
};

export default (config: Config) => {
    // eslint-disable-next-line
    const {shouldComponentAutoRequest = (_) => true} = config;
    const {auto = false} = config;
    const paths = typeof auto === 'boolean' ? [] : auto;

    if(!auto) {
        return identity();
    }

    return (Component: *) => {
        return class PropChangeHock extends React.Component<Object> {
            onPropChange(props: *) {
                if(shouldComponentAutoRequest(props)) {
                    config.onPropChange(props);
                }
            }
            componentDidMount() {
                this.onPropChange(this.props);
            }
            UNSAFE_componentWillReceiveProps(nextProps: Object) {
                const propsHaveChanged = paths
                    .some((item: string): boolean => {
                        const path = item.split('.');
                        const previous = getIn(path)(this.props);
                        const next = getIn(path)(nextProps);
                        return !equals(previous)(next);
                    });

                if(propsHaveChanged) {
                    this.onPropChange(nextProps);
                }
            }
            render(): Node {
                return <Component {...this.props} />;
            }
        };
    };
};

