export function UndefinedIdError(name: string, value?: any): Error {
    return new Error(
        `${name}.id() returned ${String(
            value
        )}. Entities need some sort of id so they can be stored and retrieved. You should check the schema to see what is going on.`
    );
}
