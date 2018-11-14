//@flow

export function NoDefinitionError(name: string): Error {
    return new Error(`Enty tried to normalize '${name}' but it has no definition. Entities must define the shape of their data.`);
}

export function CompositeKeysMustBeEntitiesError(name: string, type: string): Error {
    return new Error(`CompositeSchema compositeKeys must be an 'entity' type schema. ${name} was of type: '${type}'`);
}

export function CompositeDefinitionMustBeEntityError(name: string, type: string): Error {
    return new Error(`CompositeSchema defintions must be an 'entity' type schema. ${name} was defined as: '${type}'`);
}

export function UndefinedIdError(name: string, value: *): Error {
    return new Error(`${name}.idAttribute() returned ${String(value)}. Entities need some sort of id so they can be stored and retrieved. You should check the schema to see what is going on.`);
}
