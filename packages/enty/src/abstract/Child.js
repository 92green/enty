// @flow
import type {ChildDefinition} from '../util/definitions';
import NullSchema from '../NullSchema';

/**
 * Child
 */
export default class Child extends NullSchema {
    definition: ChildDefinition;

    constructor(definition: ChildDefinition) {
        super();
        this.definition = definition;
    }

    /**
     * Child get
     */
    get(): ChildDefinition {
        return this.definition;
    }

    /**
     * Child set
     */
    set(value: ChildDefinition): Child {
        this.definition = value;
        return this;
    }

    /**
     * Child update
     */
    update(updater: Function): Child {
        this.definition = updater(this.definition);
        return this;
    }
}
