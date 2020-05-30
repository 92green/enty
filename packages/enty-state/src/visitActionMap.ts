//
// Recurse through deep objects and apply the visitor to
// anything that isnt another object.
//
export default function visitActionMap(branch: any, visitor: Function, path: string[] = []): any {
    return branch.reduce((reduction: any, item: any, key: string): any => {
        if (typeof item === 'function') {
            reduction[key] = visitor(item, path.concat(key));
        } else {
            reduction[key] = visitActionMap(item, visitor, path.concat(key));
        }
        return reduction;
    }, {});
}
