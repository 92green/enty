import test from 'ava';
import {EntitySchema} from '../../index';
import {CompositeEntitySchema} from '../../index';
import {MapSchema} from '../../index';

import {NoDefinitionError} from '../../utils/Error';
import {CompositeKeysMustBeEntitiesError} from '../../utils/Error';

var course = EntitySchema('course').define(MapSchema());
var dog = EntitySchema('dog').define(MapSchema());
var participant = EntitySchema('participant').define(MapSchema());

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




test('CompositeEntitySchema.denormalize is the inverse of CompositeEntitySchema.normalize', (t: Object) => {
    t.deepEqual(courseParticipant.denormalize(courseParticipant.normalize(derek)).toJS(), derek);
});

test('CompositeEntitySchemas cannot be made up of structural types', (t: Object) => {
    const badDefinition = CompositeEntitySchema('badDefinition', {
        definition: MapSchema({course})
    });

    const badKeys = CompositeEntitySchema('badKeys', {
        definition: course,
        compositeKeys: {
            deep: MapSchema({participant})
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

    t.throws(() => badKeys.normalize(data));
    t.throws(() => badDefinition.normalize(data));
});

test('CompositeEntitySchemas throw without a definition', (t: Object) => {
    const badDefinition = CompositeEntitySchema('badDefinition');
    t.throws(() => badDefinition.normalize(derek));
});


test('CompositeEntitySchemas can hold CompositeEntitySchemas', (t: Object) => {

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
    t.truthy(entities.course);
    t.truthy(entities.courseParticipant);
    t.truthy(entities.dog);
    t.truthy(entities.dogCourseParticipant);
    t.truthy(entities.participant);
    t.is(result, 'lassie-123-spk456');
});

test('CompositeEntitySchemas can deffer their definition', (t: Object) => {
    var lateCourseParticipant = CompositeEntitySchema('courseParticipant', {
        compositeKeys: {
            course
        }
    });

    lateCourseParticipant.define(participant);

    t.notThrows(() => lateCourseParticipant.normalize(derek));
});


