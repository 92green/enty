# v2

```js
class NonEmptyListSchema extends ArraySchema {
    create(data) {
        return data || [];
    }
    merge(prev, next) {
        return next;
    }
}

class RecordSchema extends ObjectSchema {
    constructor(options) {
        super(options);
        this.Record = options.record;
    }
    create = (data) => new this.Record(data)
    merge = (prev, next) => prev.merge(next)
}

const person = new RecordSchema({
    record: Person,
    name: 'person',
    id: (shape) => shape.email,
    shape
});
const pet = new EntitySchema({name: 'pet'});



person.shape = new ObjectSchema({pet});


