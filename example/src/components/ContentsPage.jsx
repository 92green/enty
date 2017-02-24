import React from 'react';
import {Link} from 'react-router';
import {fromJS, List} from 'immutable'
import {
    deepFilter,
    deepMap,
    deepMapOutwards,
    deepPick,
    deepReduceOutwards
} from 'immutable-recursive';

export default (props) => {
    const routeChildPath = ['childRoutes'];
    const lists = fromJS(props.routes)
        .first()
        .update(deepFilter(ii => ii.get('path') != "*", routeChildPath))
        .update(deepMap((node, path, tree) => {

            // children will be either undefined,
            // or they will already be JSX elements by the time parents start grabbing them
            const children = node
                .getIn(routeChildPath, List())
                .update(list => list ? <ul>{list.toJS()}</ul>: null);

            const fullPath = tree
                .update(deepPick(path, routeChildPath))
                .update(deepReduceOutwards((all, node) => all.push(node), List(), routeChildPath))
                .rest()
                .map(ii => ii.get('path'))
                .join('/');

            return <li key={path.last()}><Link to={fullPath}>{node.get('path')}</Link> {children}</li>;
        }, routeChildPath));

    return <ul>{lists}</ul>
}
