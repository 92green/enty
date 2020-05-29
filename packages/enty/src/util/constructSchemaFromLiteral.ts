import map from "unmutable/lib/map"
import isObject from "./isObject"
import ObjectSchema from "../ObjectSchema"
import ArraySchema from "../ArraySchema"

export default function constructSchemaFromLiteral(literal: any): any {
    if (Array.isArray(literal)) {
        return new ArraySchema(constructSchemaFromLiteral(literal[0]))
    }
    if (isObject(literal)) {
        const keyedShape = map(constructSchemaFromLiteral)(literal)
        return new ObjectSchema(keyedShape)
    }
    return literal
}