//@flow
import EntityReducerFactory from '../EntityReducerFactory';
import {FetchingState} from '../data/RequestState';
import EntitySchema from 'enty/lib/EntitySchema';
import ArraySchema from 'enty/lib/ArraySchema';
import ObjectSchema from 'enty/lib/ObjectSchema';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

//
// Schemas
//

var author = EntitySchema('author', {idAtribute: get('fullnameId')})
    .set(ObjectSchema({}));

var topListings = EntitySchema('topListings', {idAttribute: get('fullnameId')})
    .set(ObjectSchema({author}));

var subreddit = EntitySchema('subreddit', {idAttribute: get('fullnameId')})
    .set(ObjectSchema({
        topListings: ArraySchema(topListings)
    }));

const schema = ObjectSchema({
    subreddit
});

const EntityReducer = EntityReducerFactory({schema});


// Mock data

const INITIAL_STATE = {
    thing: {
        abc: '123'
    }
};

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
        meta: {resultKey: 'TEST'},
        payload: examplePayload
    };

    const state = EntityReducer(undefined, exampleReceiveAction);

    expect(getIn(['_entities', 'subreddit', 'MK', 'fullnameId'])(state))
        .toBe(examplePayload.subreddit.fullnameId);
});


describe('EntityReducer requestState', () => {
    test('requestState is Fetching when action is _FETCH', () => {
        const data = pipeWith(
            EntityReducer(undefined, {type: 'TEST_FETCH', meta: {resultKey: 'TEST'}}),
            getIn(['_requestState', 'TEST'])
        );
        expect(data.type).toBe('Fetching');
    });

    test('requestState is Refetching when action is _FETCH and requestState already exists', () => {
        const data = pipeWith(
            EntityReducer(
                {_requestState: {TEST: FetchingState()}},
                {type: 'TEST_FETCH', meta: {resultKey: 'TEST'}}
            ),
            getIn(['_requestState', 'TEST'])
        );
        expect(data.type).toBe('Refetching');
    });

    test('will not be set if action type does not match _(FETCH|ERROR|RECIEVE)', () => {
        return pipeWith (
            EntityReducer(undefined, {type: 'nothing', meta: {resultKey: 'nothing'}}),
            getIn(['_requestState', 'nothing']),
            value => expect(value).toBe(undefined)
        );
    });

    // @FIXME: this is testing silly behaviour in the reducer.
    // The reducer should not infer result keys from the action type
    test('will be set to payload if the action matches  _ERROR', () => {
        return pipeWith (
            EntityReducer(undefined, {
                type: 'TEST_ERROR',
                payload: 'errorPayload',
                meta: {resultKey: 'TEST'}
            }),
            getIn(['_requestState', 'TEST']),
            _ => _.value(),
            value => expect(value).toBe('errorPayload')
        );
    });



});

describe('EntityReducer Config', () => {
    const action = (type) => ({type, meta: {resultKey: type}});
    test('the supplied schema is not mutated when reducing', () => {
        expect(EntityReducer(undefined, action('nothing'))._baseSchema).toBe(schema);
    });

    test('result starts with an empty object', () => {
        expect(EntityReducer(undefined, action('nothing'))._result).toEqual({});
    });

    test('will not change state if actions do not match _(FETCH|RECIEVE|ERROR)', () => {
        const state = {foo: 'bar'};
        const reducedState = EntityReducer(state, action('nothing'));
        expect(reducedState).toBe(state);

        expect(EntityReducer(INITIAL_STATE, action('FOO'))).toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, action('FOO_FETCH_BLAH'))).toBe(INITIAL_STATE);

        // check the reverse
        expect(EntityReducer(INITIAL_STATE, action('FOO_FETCH'))).not.toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, action('FOO_ERROR'))).not.toBe(INITIAL_STATE);
        expect(EntityReducer(INITIAL_STATE, action('FOO_RECEIVE'))).not.toBe(INITIAL_STATE);
    });

    test('does not have to be called with meta', () => {
        expect(() => EntityReducer(undefined, {})).not.toThrow();
    });

});

describe('EntityReducer Normalizing', () => {
    test('it will store normalized results on _result.resultKey', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {resultKey: 'TEST'},
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    other: 'foo'
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['_result', 'TEST', 'subreddit']),
            key => expect(key).toBe('MK')
        );
    });

    test('it will store normalized data on _entities.type.id', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {resultKey: 'TEST'},
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
            data => expect(data).toEqual(action.payload.subreddit)
        );
    });

    test('it will store deep entities', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {resultKey: 'TEST'},
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
            data => expect(data).toEqual({fullnameId: 'FOO'})
        );
    });

    test('it can merge two normalizations correctly', () => {
        const action = (payload) => ({
            type: 'TEST_RECEIVE',
            meta: {resultKey: 'TEST'},
            payload
        });



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
        expect(getIn(['_entities', 'topListings', 'NT'])(mergeStateTwo)).toEqual(payloadB.subreddit.topListings[0]);
        expect(getIn(['_entities', 'topListings', 'CT'])(mergeStateTwo)).toEqual(payloadA.subreddit.topListings[0]);
        expect(getIn(['_entities', 'topListings', 'GL'])(mergeStateTwo)).toEqual(payloadB.subreddit.topListings[1]);

    });
});

