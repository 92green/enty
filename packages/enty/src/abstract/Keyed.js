// @flow
import type {KeyedDefinition} from '../util/definitions';
import type {ChildDefinition} from '../util/definitions';
import NullSchema from '../NullSchema';

export default class Keyed extends NullSchema {
    definition: KeyedDefinition;

    constructor(definition: KeyedDefinition) {
        super();
        this.definition = definition;
    }

    get(key: string): ChildDefinition {
        return this.definition[key];
    }

    set(key: string, value: *): Keyed {
        this.definition[key] = value;
        return this;
    }

    update(key: string|Function, updater?: Function): Keyed {
        if(typeof key ==='function') {
            this.definition = key(this.definition);
            return this;
        }

        if(typeof updater === 'function') {
            return this.set(key, updater(this.get(key)));
        }

        throw 'updater parameter must be a function';
    }
}
