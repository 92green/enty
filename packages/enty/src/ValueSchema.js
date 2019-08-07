// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {IdAttribute} from './util/definitions';

type Options = {
    idAttribute: IdAttribute
};
export default class ValueSchema {
    name: string;
    idAttribute: Function;

    constructor(name: string, options?: Options = {}) {
        this.name = name;
        this.idAttribute = options.idAttribute || (x => x);
    }

    normalize(data: mixed, entities: Object = {}): NormalizeState {
        const {name} = this;
        const id = this.idAttribute(data);

        entities[name] = entities[name] || {};
        entities[name][id] = data;

        return {
            result: id,
            schemas: {[name]: this},
            entities
        };
    }

    denormalize(denormalizeState: DenormalizeState): any {
        const {entities, result} = denormalizeState;
        return entities[this.name][result];
    }
}

