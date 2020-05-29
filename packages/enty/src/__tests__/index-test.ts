import * as Enty from "../index"

test("that index has a defined set of exports", () => {
    expect.assertions(7) // number of exports + 1 for the exportList
    const exportList = Object.keys(Enty)
    expect(exportList).toHaveLength(6)

    expect(Enty.EntitySchema).toBeDefined()
    expect(Enty.ArraySchema).toBeDefined()
    expect(Enty.ObjectSchema).toBeDefined()
    expect(Enty.CompositeEntitySchema).toBeDefined()
    expect(Enty.IdSchema).toBeDefined()
    expect(Enty.DynamicSchema).toBeDefined()
})