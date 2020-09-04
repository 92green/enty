import isKeyed from 'unmutable/lib/util/isKeyed';
import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

//
// Recurse through deep objects and apply the visitor to
// anything that isnt another object.
//
export default function visitActionMap(branch: any, visitor: Function, path: string[] = []): any {
    return pipeWith(
        branch,
        reduce((reduction: any, item: any, key: string): any => {
            if (typeof item !== 'function' && isKeyed(item)) {
                reduction[key] = visitActionMap(item, visitor, path.concat(key));
            } else {
                reduction[key] = visitor(item, path.concat(key));
            }
            return reduction;
        }, {})
    );
}
