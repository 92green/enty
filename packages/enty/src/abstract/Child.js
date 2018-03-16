// @flow
import type {ChildDefinition} from '../util/definitions';
import NullSchema from '../NullSchema';

export default class Child extends NullSchema {
    definition: ChildDefinition;

    constructor(definition: ChildDefinition) {
        super();
        this.definition = definition;
    }

    get(): ChildDefinition {
        return this.definition;
    }

    set(value: ChildDefinition): Child {
        this.definition = value;
        return this;
    }

    update(updater: Function): Child {
        this.definition = updater(this.definition);
        return this;
    }
}
