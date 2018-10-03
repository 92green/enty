//@flow
import EntityReducerFactory from '../EntityReducerFactory';
import EntitySchema from 'enty/lib/EntitySchema';
import ListSchema from 'enty/lib/ListSchema';
import MapSchema from 'enty/lib/MapSchema';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';
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

const EntityReducer = EntityReducerFactory({schema});


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

    const state = EntityReducer(undefined, exampleReceiveAction);

    expect(getIn(['_entities', 'subreddit', 'MK', 'fullnameId'])(state))
        .toBe(examplePayload.subreddit.fullnameId);
});


describe('EntityReducer requestState', () => {
    test('_requestState.isFetching is true when action type ends with _FETCH', () => {
        const data = pipeWith(
            EntityReducer(undefined, {type: 'TEST_FETCH'}),
            getIn(['_requestState', 'TEST'])
        );
        expect(data.isFetching).toBe(true);
    });

    test('will not be set if action type does not match _(FETCH|ERROR|RECIEVE)', () => {
        return pipeWith (
            EntityReducer(undefined, {type: 'nothing'}),
            getIn(['_requestState', 'nothing']),
            value => expect(value).toBe(undefined)
        );
    });

    // @FIXME: this is testing silly behaviour in the reducer.
    // The reducer should not infer result keys from the action type
    test('will be set to payload if the action matches  _ERROR', () => {
        return pipeWith (
            EntityReducer(undefined, {type: 'TEST_ERROR', payload: 'errorPayload'}),
            getIn(['_requestState', 'TEST']),
            _ => _.value(),
            value => expect(value).toBe('errorPayload')
        );
    });



});

describe('EntityReducer Config', () => {
    test('the supplied schema is not mutated when reducing', () => {
        expect(EntityReducer(undefined, {type: 'nothing'}).get('_baseSchema'))
            .toBe(schema);
    });

    test('result starts with an empty object', () => {
        expect(EntityReducer(undefined, {type: 'nothing'}).get('_result')).toEqual({});
    });

    test('will not change state if actions do not match _(FETCH|RECIEVE|ERROR)', () => {
        const state = {foo: 'bar'};
        const reducedState = EntityReducer(state, {type: 'nothing'});
        expect(reducedState).toBe(state);

        expect(EntityReducer(INITIAL_STATE, {type: 'FOO'})).toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, {type: 'FOO_FETCH_ASDAS'})).toBe(INITIAL_STATE);

        // check the reverse
        expect(EntityReducer(INITIAL_STATE, {type: 'FOO_FETCH'})).not.toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, {type: 'FOO_ERROR'})).not.toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, {type: 'FOO_RECEIVE'})).not.toBe(INITIAL_STATE);
    });

});

describe('EntityReducer resultResetOnFetch', () => {
    test('if true it will delete resultKey on FETCH action', () => {
        const initialState = Map({
            _result: Map({
                FOO: 'FOO',
                BAR: 'BAR'
            })
        });
        const state = EntityReducer(initialState, {
            type: 'FOO_FETCH',
            meta: {resultKey: 'FOO', resultResetOnFetch: true}
        });

        expect(getIn(['_result', 'FOO'])(state)).toBe(undefined);
        expect(getIn(['_result', 'BAR'])(state)).toBe('BAR');
    });

    test('if false it will not delete resultKey on FETCH action', () => {
        const initialState = Map({
            _result: Map({
                FOO: 'FOO',
                BAR: 'BAR'
            })
        });
        const state = EntityReducer(initialState, {
            type: 'FOO_FETCH',
            meta: {resultKey: 'FOO', resultResetOnFetch: false}
        });

        expect(getIn(['_result', 'FOO'])(state)).toBe('FOO');
        expect(getIn(['_result', 'BAR'])(state)).toBe('BAR');
    });
});

describe('EntityReducer Normalizing', () => {
    test('it will store normalized results on _result.resultKey', () => {
        const action = {
            type: 'TEST_RECEIVE',
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    other: 'foo'
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['_result', 'TEST_RECEIVE', 'subreddit']),
            key => expect(key).toBe('MK')
        );
    });

    test('it will store normalized data on _entities.type.id', () => {
        const action = {
            type: 'TEST_RECEIVE',
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    other: 'foo'
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['_entities', 'subreddit', 'MK']),
            data => expect(data.toJS()).toEqual(action.payload.subreddit)
        );
    });

    test('it will store deep entities', () => {
        const action = {
            type: 'TEST_RECEIVE',
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    topListings: [
                        {fullnameId: 'FOO'},
                        {fullnameId: 'BAR'}
                    ]
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['_entities', 'topListings', 'FOO']),
            data => expect(data.toJS()).toEqual({fullnameId: 'FOO'})
        );
    });

    test('it can merge two normalizations correctly', () => {
        const action = (payload) => ({type: 'TEST_RECEIVE', payload});

        const payloadA = {
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


        const payloadB = {
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

        const mergeStateOne = EntityReducer(undefined, action(payloadA));
        const mergeStateTwo = EntityReducer(mergeStateOne, action(payloadB));

        expect(getIn(['_entities', 'subreddit', 'MK', 'name'])(mergeStateTwo)).toBe(payloadB.subreddit.name);
        expect(getIn(['_entities', 'subreddit', 'MK', 'tags'])(mergeStateTwo)).toEqual(payloadB.subreddit.tags);
        expect(getIn(['_entities', 'subreddit', 'MK', 'code'])(mergeStateTwo)).toBe(payloadA.subreddit.code);
        expect(getIn(['_entities', 'topListings', 'NT'])(mergeStateTwo).toJS()).toEqual(payloadB.subreddit.topListings[0]);
        expect(getIn(['_entities', 'topListings', 'CT'])(mergeStateTwo).toJS()).toEqual(payloadA.subreddit.topListings[0]);
        expect(getIn(['_entities', 'topListings', 'GL'])(mergeStateTwo).toJS()).toEqual(payloadB.subreddit.topListings[1]);

    });
});

