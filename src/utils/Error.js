//@flow

export function NoDefinitionError(name: string): Error {
    return new Error(`Enty tried to normalize ${name} but ${name} has no definition. Entity's must define the shape of their data.`);
}
