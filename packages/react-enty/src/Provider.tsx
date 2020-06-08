import React, {Component, ReactNode} from 'react';
import {EntityStore} from 'enty-state';
import {StoreContext} from './StoreContext';

type Props = {
    children: ReactNode;
    debug?: string;
    store: EntityStore<any>;
};

type State = {
    count: number;
    store: EntityStore<any>;
};

export default class Provider extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        props.store.subscribe(this.updateStore.bind(this));
        this.state = {
            count: 0,
            store: props.store
        };
    }
    updateStore(store: EntityStore<any>) {
        this.setState({store, count: store.normalizeCount});
    }
    render() {
        return <StoreContext.Provider children={this.props.children} value={this.state} />;
    }
}
