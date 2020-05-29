import constructSchemaFromLiteral from "../constructSchemaFromLiteral"
import ArraySchema from "../../ArraySchema"
import ObjectSchema from "../../ObjectSchema"
import EntitySchema from "../../EntitySchema"

it("will replace arrays with array schemas", () => {
    expect(constructSchemaFromLiteral([])).toBeInstanceOf(ArraySchema)
})

it("will replace objects with object schemas", () => {
    expect(constructSchemaFromLiteral({})).toBeInstanceOf(ObjectSchema)
})

it("will not touch other schemas", () => {
    const schema = new EntitySchema("name")
    expect(constructSchemaFromLiteral(schema)).toBeInstanceOf(EntitySchema)
    expect(constructSchemaFromLiteral(schema)).not.toBeInstanceOf(ObjectSchema)
})

it("will recurse deeply through arrays and objects", () => {
    const schema = constructSchemaFromLiteral({
        fooList: [new EntitySchema("foo")],
    })

    expect(schema).toBeInstanceOf(ObjectSchema)
    expect(schema.shape.fooList).toBeInstanceOf(ArraySchema)
    //expect(schema.shape.fooList.shape).toBeInstanceOf(EntitySchema);
})