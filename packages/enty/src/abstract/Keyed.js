// @flow
import type {KeyedDefinition} from '../util/definitions';
import type {ChildDefinition} from '../util/definitions';
import NullSchema from '../NullSchema';

/**
 * Class for keyed.
 */
export default class Keyed extends NullSchema {
    definition: KeyedDefinition;
    keys: Array<string>;

    constructor(definition: KeyedDefinition) {
        super();
        this.definition = definition;
        this._refreshKeys();
        this.keys = Object.keys(definition);
    }

    _refreshKeys() {
        this.keys = Object.keys(this.definition);
    }

    /**
     * get
     */
    get(key: string): ChildDefinition {
        return this.definition[key];
    }

    /**
     * set
     */
    set(key: string, value: *): Keyed {
        this.definition[key] = value;
        this._refreshKeys();
        return this;
    }

    /**
     * update
     */
    update(key: string|Function, updater?: Function): Keyed {
        if(typeof key ==='function') {
            this.definition = key(this.definition);
            this._refreshKeys();
            return this;
        }

        if(typeof updater === 'function') {
            return this.set(key, updater(this.get(key)));
        }

        throw 'updater parameter must be a function';
    }
}
