// Recurse through deep objects and apply the visitor to functions
export default function visitActionMap(branch: any, visitor: Function, path: string[] = []): any {
    return Object.keys(branch).reduce((reduction: any, key: string): any => {
        const item = branch[key];
        if (typeof item === 'function') {
            reduction[key] = visitor(item, path.concat(key));
        } else {
            reduction[key] = visitActionMap(item, visitor, path.concat(key));
        }
        return reduction;
    }, {});
}
