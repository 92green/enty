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
        meta: {reponseKey: 'TEST'},
        payload: examplePayload
    };

    const state = EntityReducer(undefined, exampleReceiveAction);

    expect(getIn(['entities', 'subreddit', 'MK', 'fullnameId'])(state))
        .toBe(examplePayload.subreddit.fullnameId);
});


describe('EntityReducer requestState', () => {
    test('requestState is Fetching when action is _FETCH', () => {
        const data = pipeWith(
            EntityReducer(undefined, {type: 'TEST_FETCH', meta: {reponseKey: 'TEST'}}),
            getIn(['requestState', 'TEST'])
        );
        expect(data.type).toBe('Fetching');
    });

    test('requestState is Refetching when action is _FETCH and requestState already exists', () => {
        const data = pipeWith(
            EntityReducer(
                {requestState: {TEST: FetchingState()}},
                {type: 'TEST_FETCH', meta: {reponseKey: 'TEST'}}
            ),
            getIn(['requestState', 'TEST'])
        );
        expect(data.type).toBe('Refetching');
    });

    test('will not be set if action type does not match _(FETCH|ERROR|RECIEVE)', () => {
        return pipeWith (
            EntityReducer(undefined, {type: 'nothing', meta: {reponseKey: 'nothing'}}),
            getIn(['requestState', 'nothing']),
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
                meta: {reponseKey: 'TEST'}
            }),
            getIn(['requestState', 'TEST']),
            _ => _.value(),
            value => expect(value).toBe('errorPayload')
        );
    });



});

describe('EntityReducer Config', () => {
    const action = (type) => ({type, meta: {reponseKey: type}});
    test('the supplied schema is not mutated when reducing', () => {
        expect(EntityReducer(undefined, action('nothing')).baseSchema).toBe(schema);
    });

    test('response starts with an empty object', () => {
        expect(EntityReducer(undefined, action('nothing')).response).toEqual({});
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
    test('it will store normalized results on _result.reponseKey', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {reponseKey: 'TEST'},
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    other: 'foo'
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['response', 'TEST', 'subreddit']),
            key => expect(key).toBe('MK')
        );
    });

    test('it will store normalized data on _entities.type.id', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {reponseKey: 'TEST'},
            payload: {
                subreddit: {
                    fullnameId: 'MK',
                    other: 'foo'
                }
            }
        };

        return pipeWith(
            EntityReducer(undefined, action),
            getIn(['entities', 'subreddit', 'MK']),
            data => expect(data).toEqual(action.payload.subreddit)
        );
    });

    test('it will store deep entities', () => {
        const action = {
            type: 'TEST_RECEIVE',
            meta: {reponseKey: 'TEST'},
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
            getIn(['entities', 'topListings', 'FOO']),
            data => expect(data).toEqual({fullnameId: 'FOO'})
        );
    });

    test('it can merge two normalizations correctly', () => {
        const action = (payload) => ({
            type: 'TEST_RECEIVE',
            meta: {reponseKey: 'TEST'},
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

        expect(getIn(['entities', 'subreddit', 'MK', 'name'])(mergeStateTwo)).toBe(payloadB.subreddit.name);
        expect(getIn(['entities', 'subreddit', 'MK', 'tags'])(mergeStateTwo)).toEqual(payloadB.subreddit.tags);
        expect(getIn(['entities', 'subreddit', 'MK', 'code'])(mergeStateTwo)).toBe(payloadA.subreddit.code);
        expect(getIn(['entities', 'topListings', 'NT'])(mergeStateTwo)).toEqual(payloadB.subreddit.topListings[0]);
        expect(getIn(['entities', 'topListings', 'CT'])(mergeStateTwo)).toEqual(payloadA.subreddit.topListings[0]);
        expect(getIn(['entities', 'topListings', 'GL'])(mergeStateTwo)).toEqual(payloadB.subreddit.topListings[1]);

    });
});


describe('no schema reducer', () => {

    it('will not normalize if a schema is not provided', () => {
        const reducer = EntityReducerFactory({});
        const stateA = reducer(undefined, {type: 'TEST_RECEIVE', payload: 'FOO', meta: {reponseKey: '123'}});

        expect(stateA.entities).toEqual({});
        expect(stateA.response['123']).toBe('FOO');
        expect(stateA.response['456']).toBeUndefined();
        expect(stateA.stats.responseCount).toBe(1);

        const stateB = reducer(stateA, {type: 'TEST_RECEIVE', payload: 'BAR', meta: {reponseKey: '456'}});
        expect(stateB.response['123']).toBe('FOO');
        expect(stateB.response['456']).toBe('BAR');
        expect(stateB.stats.responseCount).toBe(2);

    });

});
