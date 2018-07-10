//@flow
import EntityReducerFactory from '../EntityReducerFactory';
import EntitySchema from 'enty/lib/EntitySchema';
import ListSchema from 'enty/lib/ListSchema';
import MapSchema from 'enty/lib/MapSchema';
import get from 'unmutable/lib/get';
import {is, fromJS, Map} from 'immutable';

//
// Schemas
//

var author = EntitySchema('author', {idAtribute: get('fullnameId')})
    .set(MapSchema({}))

var topListings = EntitySchema('topListings', {
    idAttribute: get('fullnameId'),
    definition: MapSchema({author})
});

var subreddit = EntitySchema('subreddit', {
    idAttribute: get('fullnameId'),
    definition: MapSchema({topListings: ListSchema(topListings)})
});

const schema = MapSchema({
    subreddit
});

const schemaMap = {
    ENTITY_RECEIVE: schema,
    TEST_RECEIVE: schema
};

const EntityReducer = EntityReducerFactory({
    schemaMap,
    afterNormalize: value => value
});


// Mock data

const INITIAL_STATE = fromJS({
    thing: {
        abc: '123'
    }
});

test('EntityReducerFactory normalizes a reuslt', () => {
    const examplePayload = {
        subreddit: {
            name: "MechanicalKeyboards",
            fullnameId: "MK",
            topListings: [
                {fullnameId: "CT", title: "Cool title"},
                {fullnameId: "NT", title: "Nice title"}
            ]
        }
    };

    const exampleReceiveAction = {
        type: 'TEST_RECEIVE',
        payload: examplePayload
    };

    const state = EntityReducer(INITIAL_STATE, exampleReceiveAction);

    expect(state.getIn(['subreddit', 'MK', 'fullnameId']))
        .toBe(examplePayload.subreddit.fullnameId);
});

test('EntityReducerFactory _requestState.isFetching is true when action type ends with _FETCH', () => {
    expect(
        EntityReducer(undefined, {type: 'TEST_FETCH'}).getIn(['_requestState', 'TEST']).isFetching
    ).toBe(true);
});

test('EntityReducerFactory', () => {


    const exampleAction = {
        type: "myType"
    };

    expect(is(
        EntityReducer(undefined, exampleAction).get('_baseSchema'),
        Map(schemaMap)
    )).toBe(true);

    expect(is(
        EntityReducer(undefined, exampleAction).get('_result'),
        Map()
    )).toBe(true);



    expect(EntityReducer(undefined, exampleAction)
        .getIn(['_requestState', 'myType'])).toBe(undefined);

    expect(EntityReducer(undefined, {type: 'TEST_ERROR', payload: 'errorPayload'})
        .getIn(['_requestState', 'TEST'])
        .errorFlatMap(ii => ii)).toBe('errorPayload');

    const exampleState = fromJS({
        thing: {
            abc: '123'
        }
    });

    expect(is(
        EntityReducer(exampleState, exampleAction).get('thing'),
        fromJS({abc: '123'})
    )).toBe(true);

    const exampleStateWithResults = fromJS({
        thing: {
            abc: '123'
        },
        _result: {
            TEST_FETCH: [
                'xyz'
            ],
            TEST_OTHER_FETCH: [
                'xyz'
            ]
        }
    });

    expect(is(
        EntityReducer(exampleStateWithResults, exampleAction).get('_result'),
        exampleStateWithResults.get('_result')
    )).toBe(true);

    const exampleActionNoResultReset = {
        type: 'TEST_FETCH',
        meta: {
            resultResetOnFetch: true
        }
    };

    expect(is(
        EntityReducer(exampleStateWithResults, exampleActionNoResultReset).get('_result'),
        exampleStateWithResults.get('_result').delete('TEST_FETCH')
    )).toBe(true);


    expect(is(
        EntityReducer(exampleStateWithResults, {type: 'TEST_FETCH'}).get('_result'),
        exampleStateWithResults.get('_result')
    )).toBe(true);

    const examplePayload = {
        subreddit: {
            name: "MechanicalKeyboards",
            fullnameId: "MK",
            topListings: [
                {
                    "fullnameId": "CT",
                    "title": "Cool title"
                },
                {
                    "fullnameId": "NT",
                    "title": "Nice title"
                }
            ]
        }
    };

    const exampleReceiveAction = {
        type: 'TEST_RECEIVE',
        payload: examplePayload
    };

    expect(
        EntityReducer(exampleState, exampleReceiveAction).getIn(['_result', 'TEST_RECEIVE', 'subreddit'])
    ).toBe('MK');

    expect(is(
        EntityReducer(exampleState, exampleReceiveAction)
            .getIn(['subreddit', 'MK'])
            .delete('topListings'),
        fromJS(examplePayload.subreddit).delete('topListings')
    )).toBe(true);

    expect(is(
        EntityReducer(exampleState, exampleReceiveAction).getIn(['topListings', 'NT']),
        fromJS(examplePayload.subreddit.topListings[1])
    )).toBe(true);

    const mergeExamplePayloadOne = {
        subreddit: {
            name: "MechanicalKeyboards",
            code: "123",
            fullnameId: "MK",
            topListings: [
                {
                    "fullnameId": "CT",
                    "title": "Cool title"
                },
                {
                    "fullnameId": "NT",
                    "title": "Nice title"
                }
            ],
            tags: [
                "A",
                "B"
            ]
        }
    };

    const mergeExampleReceiveActionOne = {
        type: 'TEST_RECEIVE',
        payload: mergeExamplePayloadOne
    };

    const mergeExamplePayloadTwo = {
        subreddit: {
            name: "MechanicalKeyboards!",
            fullnameId: "MK",
            topListings: [
                {
                    "fullnameId": "NT",
                    "title": "Nice title!"
                },
                {
                    "fullnameId": "GL",
                    "title": "Good luck"
                }
            ],
            tags: [
                "C",
                "D"
            ]
        }
    };

    const mergeExampleReceiveActionTwo = {
        type: 'TEST_RECEIVE',
        payload: mergeExamplePayloadTwo
    };

    const mergeStateOne = EntityReducer(exampleState, mergeExampleReceiveActionOne);
    const mergeStateTwo = EntityReducer(mergeStateOne, mergeExampleReceiveActionTwo);

    expect(mergeStateTwo.getIn(['subreddit', 'MK', 'name'])).toBe(mergeExamplePayloadTwo.subreddit.name);
    expect(mergeStateTwo.getIn(['subreddit', 'MK', 'tags'])).toEqual(mergeExamplePayloadTwo.subreddit.tags);
    expect(mergeStateTwo.getIn(['subreddit', 'MK', 'code'])).toBe(mergeExamplePayloadOne.subreddit.code);
    expect(mergeStateTwo.getIn(['topListings', 'NT']).toJS()).toEqual(mergeExamplePayloadTwo.subreddit.topListings[0]);
    expect(mergeStateTwo.getIn(['topListings', 'CT']).toJS()).toEqual(mergeExamplePayloadOne.subreddit.topListings[0]);
    expect(mergeStateTwo.getIn(['topListings', 'GL']).toJS()).toEqual(mergeExamplePayloadTwo.subreddit.topListings[1]);

});

//
// Don't update state for other actions.

test("foreign actions will preserve state.entity's strict object equality", () => {
    // check bad keys
    expect(EntityReducer(INITIAL_STATE, {type: 'FOO'})).toBe(INITIAL_STATE);
    expect(EntityReducer(INITIAL_STATE, {type: 'FOO_FETCH_ASDAS'})).toBe(INITIAL_STATE);

    // check the reverse
    expect(EntityReducer(INITIAL_STATE, {type: 'FOO_FETCH'})).not.toBe(INITIAL_STATE);
    expect(EntityReducer(INITIAL_STATE, {type: 'FOO_ERROR'})).not.toBe(INITIAL_STATE);
    expect(EntityReducer(INITIAL_STATE, {type: 'FOO_RECEIVE'})).not.toBe(INITIAL_STATE);
});




