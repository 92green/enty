//@flow
import EntitySchema from '../EntitySchema';
import CompositeEntitySchema from '../CompositeEntitySchema';
import ObjectSchema from '../ObjectSchema';

var course = new EntitySchema('course');
var dog = new EntitySchema('dog');
var participant = new EntitySchema('participant');

course.shape = new ObjectSchema({});
dog.shape = new ObjectSchema({});
participant.shape = new ObjectSchema({});

var courseParticipant = new CompositeEntitySchema('courseParticipant', {
    shape: participant,
    compositeKeys: {
        course
    }
});

var dogCourseParticipant = new CompositeEntitySchema('dogCourseParticipant', {
    shape: dog,
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
    const badDefinition = new CompositeEntitySchema('badDefinition', {
        shape: new ObjectSchema({course})
    });

    const badKeys = new CompositeEntitySchema('badKeys', {
        shape: course,
        compositeKeys: {
            deep: new ObjectSchema({participant})
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
    const {idAttribute} = new CompositeEntitySchema('foo');
    expect(idAttribute()).toBe(undefined);
});

test('throw without a definition', () => {
    expect(() => new CompositeEntitySchema('foo').normalize(derek, {})).toThrow();
    expect(() => new CompositeEntitySchema('foo', {definition: null}).normalize(derek, {})).toThrow();
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
    var lateCourseParticipant = new CompositeEntitySchema('courseParticipant', {
        compositeKeys: {
            course
        }
    });

    lateCourseParticipant.shape = participant;

    expect(() => lateCourseParticipant.normalize(derek)).not.toThrow();
});


test('compositeKeys will override defintion keys ', () => {
    const cat = new EntitySchema('cat', {
        shape: new ObjectSchema({friend: dog})
    });

    const owl = new EntitySchema('owl', {
        shape: new ObjectSchema({})
    });

    var catOwl = new CompositeEntitySchema('catOwl', {
        shape: cat,
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


