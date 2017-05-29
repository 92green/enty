export class EntitySchema {
    constructor(name, children, options = {}) {
        this.name = name;
        this.type = 'entity';
        this.children = children;
        this.options = {
            idAttribute: item => item && item.id,
            denormalizeFilter: item => item.get('name'),
            ...options
        };
    }
    define(children) {
        this.children = Object.assign({}, children);
    }
}


export class ArraySchema {
    constructor(schema, options = {}) {
        this.type = 'array';
        this.itemSchema = schema;
        this.options = {
            idAttribute: item => item && item.id,
            ...options
        };
    }
}

export class ObjectSchema {
    constructor(schema, options = {}) {
        this.type = 'object';
        this.itemSchema = schema;
        this.options = {
            idAttribute: item => item && item.id,
            denormalizeFilter: () => true,
            ...options
        };
    }
}
