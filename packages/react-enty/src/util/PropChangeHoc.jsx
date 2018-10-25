// @flow
import type {Node} from 'react';

import React from 'react';
import getIn from 'unmutable/lib/getIn';
import equals from 'unmutable/lib/equals';

type Config = {
    paths: Array<string>,
    onPropChange: Function
};

export default (config: Config) => (Component: *) => {
    return class PropChangeHock extends React.Component<Object> {
        onPropChange: Function;
        componentDidMount() {
            config.onPropChange(this.props);
        }
        componentWillReceiveProps(nextProps: Object) {
            const propsHaveChanged = config.paths
                .some((item: string): boolean => {
                    const path = item.split('.');
                    const previous = getIn(path)(this.props);
                    const next = getIn(path)(nextProps);
                    return !equals(previous)(next);
                });

            if(propsHaveChanged) {
                config.onPropChange(nextProps);
            }
        }
        render(): Node {
            return <Component {...this.props} />;
        }
    };
};

