import {Iterable} from 'immutable';

export default function DetermineReviverType(constructor, schemaKey) {
    return (key, value) => {
        // Check if the value is an array or object and convert to that for them.
        const isIndexed = Iterable.isIndexed(value);
        const returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(key || schemaKey, returnValue);
    }
}
