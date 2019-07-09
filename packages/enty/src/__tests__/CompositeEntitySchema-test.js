//@flow
import EntitySchema from '../EntitySchema';
import CompositeEntitySchema from '../CompositeEntitySchema';
import ObjectSchema from '../ObjectSchema';
import {NoDefinitionError} from '../util/Error';

var course = EntitySchema('course').set(ObjectSchema());
var dog = EntitySchema('dog').set(ObjectSchema());
var participant = EntitySchema('participant').set(ObjectSchema());

var courseParticipant = CompositeEntitySchema('courseParticipant', {
    definition: participant,
    compositeKeys: {
        course
    }
});

var dogCourseParticipant = CompositeEntitySchema('dogCourseParticipant', {
    definition: dog,
    compositeKeys: {
        courseParticipant
    }
});

const derek = {
    id: '123',
    name: 'Derek Tibbs',
    course: {
        id: 'spk456',
        courseName: 'Learn All The Things!'
    }
};




test('denormalize is the inverse of normalize', () => {
    expect(courseParticipant.denormalize(courseParticipant.normalize(derek))).toEqual(derek);
});

test('cannot be made up of structural types', () => {
    const badDefinition = CompositeEntitySchema('badDefinition', {
        definition: ObjectSchema({course})
    });

    const badKeys = CompositeEntitySchema('badKeys', {
        definition: course,
        compositeKeys: {
            deep: ObjectSchema({participant})
        }
    });

    const data = {
        id: '123',
        deep: {
            participant: {
                id: 'spk456',
                courseName: 'Learn All The Things!'
            }
        }
    };

    expect(() => badKeys.normalize(data)).toThrow();
    expect(() => badDefinition.normalize(data)).toThrow();
});

test('options.idAttribute defaults to an empty function', () => {
    const {idAttribute} = CompositeEntitySchema('foo').options;
    expect(idAttribute()).toBe(undefined);
});

test('throw without a definition', () => {
    expect(() => CompositeEntitySchema('foo').normalize(derek, {})).toThrow();
    expect(() => CompositeEntitySchema('foo', {definition: null}).normalize(derek, {})).toThrow();
});


test('can hold CompositeEntitySchemas', () => {

    const aa = {
        id: 'lassie',
        courseParticipant: {
            id: '123',
            name: 'Derek Tibbs',
            course: {
                id: 'spk456',
                courseName: 'Learn All The Things!'
            }
        }
    };

    const {entities, result} = dogCourseParticipant.normalize(aa);
    expect(entities.course).toBeTruthy();
    expect(entities.courseParticipant).toBeTruthy();
    expect(entities.dog).toBeTruthy();
    expect(entities.dogCourseParticipant).toBeTruthy();
    expect(entities.participant).toBeTruthy();
    expect(result).toBe('lassie-123-spk456');
});

test('can defer their definition', () => {
    var lateCourseParticipant = CompositeEntitySchema('courseParticipant', {
        compositeKeys: {
            course
        }
    });

    lateCourseParticipant.set(participant);

    expect(() => lateCourseParticipant.normalize(derek)).not.toThrow();
});


test('compositeKeys will override defintion keys ', () => {
    const cat = EntitySchema('cat', {
        definition: ObjectSchema({
            friend: dog
        })
    });

    const owl = EntitySchema('owl').set(ObjectSchema());

    var catOwl = CompositeEntitySchema('catOwl', {
        definition: cat,
        compositeKeys: {
            friend: owl
        }
    });

    const {entities} = catOwl.normalize({
        id: 'sparky',
        friend: {
            id: 'hedwig'
        }
    });


    expect(entities.catOwl['sparky-hedwig']).toBeTruthy();
    expect(entities.dog).toBeFalsy();
});

test('will not try to normalize null compositeKeys', () => {
    expect(() => courseParticipant.normalize({id: 'rad'})).not.toThrow();
});

test('will not try to denormalize null compositeKeys', () => {
    const data = {id: 'rad'};
    expect(() => courseParticipant.denormalize(courseParticipant.normalize(data))).not.toThrow();
});




//
// Geters and Seters
//
test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = courseParticipant;
    expect(schema.set(dog)).toBe(schema);
    expect(schema.get()).toBe(dog);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('set will replace the definition at a key', () => {
    const schema = courseParticipant
    schema.set(dog);
    expect(schema.definition).toBe(dog);
});

test('get will return the definition at a key', () => {
    expect(courseParticipant.get()).toBe(dog);
});

test('update will replace the whole definition via an updater function', () => {
    courseParticipant.update(() => dog);
    expect(courseParticipant.definition).toBe(dog);
});

