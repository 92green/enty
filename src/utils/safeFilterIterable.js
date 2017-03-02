// @flow
import {Iterable} from 'immutable';

export default function safeFilterIterable(filterKey: string): Function {
    return function safeFilterRecurse(item: Object): Object {

        // make a list of all keys whose children have a `filterKey` props of true
        return item.keySeq()
            .filter(key => item.getIn([key, filterKey], false))
            // fold that list into `item` wih a delete
            // this has the effect of removing children that have `filterKey` props of true
            // without actually iterating over the child at all
            .reduce((newItem, deleteKey) => newItem.delete(deleteKey), item)
            .update((newState: Object): Object => {
                // perform the same style call again
                // but this time we use all keys and if the child is
                // iterable we will recurse down
                return newState.keySeq()
                    .reduce((branch: Object, key: string): Object => {
                        if(Iterable.isIterable(branch.get(key))) {
                            return branch.set(key, safeFilterRecurse(branch.get(key)));
                        }
                        return branch;
                    }, newState);
            });
    };
}
