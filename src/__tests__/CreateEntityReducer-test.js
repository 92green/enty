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

const schemaMap = {
    ENTITY_RECEIVE: EntitySchema,
    TEST_RECEIVE: EntitySchema
};

const EntityReducer = createEntityReducer({
    schemaMap,
    afterNormalize: value => value,
});

test('CreateEntityReducer', tt => {



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
            .getIn(['_requestState', 'TEST', 'fetch']),
        '_requestState.fetch is true when action type ends with _FETCH'
    );

    tt.false(
        EntityReducer(undefined, exampleAction)
            .getIn(['_requestState', 'myType', 'fetch']),
        '_requestState.fetch is false when action type does not end with _FETCH'
    );

    tt.is(
        EntityReducer(undefined, {type: 'TEST_ERROR', payload: 'errorPayload'})
            .getIn(['_requestState', 'TEST', 'error']),
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
            EntityReducer(exampleState, exampleReceiveAction)
                .getIn(['subreddit', 'MK'])
                .delete('topListings'),
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

    tt.is(
        mergeStateTwo.getIn(['subreddit', 'MK', 'name']),
        mergeExamplePayloadTwo.subreddit.name,
        'Receiving updated values on the top level of an entity item will replace existing values'
    );

    tt.true(
        is(
            mergeStateTwo.getIn(['subreddit', 'MK', 'tags']),
            fromJS(mergeExamplePayloadTwo.subreddit.tags)
        ),
        'Receiving updated non-entity values on the second level of an entity are not merged, they are replaced'
    );

    tt.is(
        mergeStateTwo.getIn(['subreddit', 'MK', 'code']),
        mergeExamplePayloadOne.subreddit.code,
        'Existing top level keys and values on an entity item will remain when subsequent received data does not contain those top level keys'
    );

    tt.true(
        is(
            mergeStateTwo.getIn(['topListings', 'NT']),
            fromJS(mergeExamplePayloadTwo.subreddit.topListings[0])
        ),
        'Receiving updated info for an entity will replace nested entities'
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


test('ENTITY_DELETE will add a key of __deleted:true if the key path finds a keyedIterable', tt => {
    tt.deepEqual(
        EntityReducer(fromJS({foo: {bar: {}}}), {type: 'ENTITY_DELETE', payload: ['foo', 'bar']}).toJS(),
        {foo: {bar:{__deleted:true}}},
    );
});

test('ENTITY_UNDO_DELETE will add a key of __deleted:false if the key path finds a keyedIterable', tt => {
    tt.deepEqual(
        EntityReducer(fromJS({foo: {bar: {}}}), {type: 'ENTITY_UNDO_DELETE', payload: ['foo', 'bar']}).toJS(),
        {foo: {bar:{__deleted:false}}},
    );
});

