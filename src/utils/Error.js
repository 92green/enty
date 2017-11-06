//@flow

export function NoDefinitionError(name: string): Error {
    return new Error(`Enty tried to normalize '${name}' but it has no definition. Entities must define the shape of their data.`);
}
