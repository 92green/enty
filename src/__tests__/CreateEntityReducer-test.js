import test from 'ava';
import {createEntityReducer} from '../CreateEntityReducer';
import {Schema, arrayOf} from 'normalizr';
import {is, fromJS, Map} from 'immutable';

//
// Schemas
//


var SubredditSchema = new Schema('subreddit', {idAttribute: 'fullnameId'});
var AuthorSchema = new Schema('author', {idAttribute: 'fullnameId'});
var TopListingSchema = new Schema('topListings', {idAttribute: 'fullnameId'});

TopListingSchema.define({
    author: AuthorSchema
});

SubredditSchema.define({
    topListings: arrayOf(TopListingSchema)
});

const EntitySchema = {
    subreddit: SubredditSchema
}

test('CreateEntityReducer', tt => {

    const schemaMap = {
        mainSchema: EntitySchema,
        TEST_RECEIVE: EntitySchema
    };

    const EntityReducer = createEntityReducer(schemaMap, (key, value) => value);

    const exampleAction = {
        type: "myType"
    };

    tt.true(
        is(
            EntityReducer(undefined, exampleAction).get('_schema'),
            Map(schemaMap)
        ),
        'Immutable version of schema is returned under _schema when reducer is called with no existing state'
    );

    tt.true(
        is(
            EntityReducer(undefined, exampleAction).get('_result'),
            Map()
        ),
        '_result is empty  when reducer is called with no existing state'
    );

    tt.true(
        EntityReducer(undefined, {type: 'TEST_FETCH'})
            .getIn(['_requestState', 'TEST_FETCH', 'fetch']),
        '_requestState.fetch is true when action type ends with _FETCH'
    );

    tt.false(
        EntityReducer(undefined, exampleAction)
            .getIn(['_requestState', 'myType', 'fetch']),
        '_requestState.fetch is false when action type does not end with _FETCH'
    );

    tt.is(
        EntityReducer(undefined, {type: 'TEST_ERROR', payload: 'errorPayload'})
            .getIn(['_requestState', 'TEST_ERROR', 'error']),
        'errorPayload',
        '_requestState.error equals payload when action type ends with _ERROR'
    );

    tt.is(
        EntityReducer(undefined, exampleAction)
            .getIn(['_requestState', 'myType', 'error']),
        null,
        '_requestState.error equals is null when action type does not end with _ERROR'
    );

    const exampleState = fromJS({
        thing: {
            abc: '123'
        }
    });

    tt.true(
        is(
            EntityReducer(exampleState, exampleAction).get('thing'),
            fromJS({abc: '123'})
        ),
        'data on state is unchanged when not receiving data'
    );

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

    tt.true(
        is(
            EntityReducer(exampleStateWithResults, exampleAction).get('_result'),
            exampleStateWithResults.get('_result')
        ),
        'state._result is unchanged when not receiving data'
    );

    tt.true(
        is(
            EntityReducer(exampleStateWithResults, {type: 'TEST_FETCH'}).get('_result'),
            exampleStateWithResults.get('_result').delete('TEST_FETCH')
        ),
        'state._result.TYPE is deleted when TYPE is fetched'
    );

    const exampleActionNoResultReset = {
        type: 'TEST_FETCH',
        meta: {
            resultResetOnFetch: false
        }
    };

    tt.true(
        is(
            EntityReducer(exampleStateWithResults, exampleActionNoResultReset).get('_result'),
            exampleStateWithResults.get('_result')
        ),
        'state._result.TYPE is unchanged when a type is fetched AND meta.resultResetOnFetch is true'
    );

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

    tt.is(
        EntityReducer(exampleState, exampleReceiveAction).getIn(['_result', 'TEST_RECEIVE', 'subreddit']),
        'MK',
        'Normalized results are stored in state under _result.ACTIONNAME.KEY'
    );

    tt.true(
        is(
            EntityReducer(exampleState, exampleReceiveAction).getIn(['subreddit', 'MK']).delete('topListings'),
            fromJS(examplePayload.subreddit).delete('topListings')
        ),
        'Normalized entities are stored in state under ENTITYNAME.ID'
    );

    tt.true(
        is(
            EntityReducer(exampleState, exampleReceiveAction).getIn(['topListings', 'NT']),
            fromJS(examplePayload.subreddit.topListings[1])
        ),
        'Normalized nested entities are stored in state under ENTITYNAME.ID'
    );

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
            ]
        }
    };

    const mergeExampleReceiveActionTwo = {
        type: 'TEST_RECEIVE',
        payload: mergeExamplePayloadTwo
    };

    const mergeStateOne = EntityReducer(exampleState, mergeExampleReceiveActionOne);
    const mergeStateTwo = EntityReducer(mergeStateOne, mergeExampleReceiveActionTwo);

    tt.true(
        is(
            mergeStateTwo.getIn(['subreddit', 'MK']).delete('topListings'),
            fromJS(mergeExamplePayloadTwo.subreddit).delete('topListings')
        ),
        'Receiving updated info for an entity will replace entity data'
    );

    tt.true(
        is(
            mergeStateTwo.getIn(['topListings', 'NT']),
            fromJS(mergeExamplePayloadTwo.subreddit.topListings[0])
        ),
        'Receiving updated info for an entity will replace nested entity data'
    );

    tt.true(
        is(
            mergeStateTwo.getIn(['topListings', 'CT']),
            fromJS(mergeExamplePayloadOne.subreddit.topListings[0])
        ),
        'Once an entity is received, its entity data is retained even if subsequent received entities dont contain it'
    );

    tt.true(
        is(
            mergeStateTwo.getIn(['topListings', 'GL']),
            fromJS(mergeExamplePayloadTwo.subreddit.topListings[1])
        ),
        'Newly received nested entites are merged into their entity container'
    );

});
