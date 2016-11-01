import test from 'ava';
import DetermineReviverType from '../DetermineReviverType';
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

test('DetermineReviverType', tt => {

    const constructor = (key, value) => Map({key, value});
    const schemaKey = 'mySchemaKey';
    const reviver = DetermineReviverType(constructor, schemaKey);

    const exampleMap = fromJS({abc: 123});
    const exampleList = fromJS([1,2,3]);

    tt.true(
        is(
            reviver('?', exampleMap).get('value'),
            exampleMap
        ),
        'revivier is transparent to Maps'
    );

    tt.true(
        is(
            reviver('?', exampleList).get('value'),
            exampleList
        ),
        'revivier is transparent to Lists'
    );

    tt.true(
        is(
            reviver('?', exampleMap).get('key'),
            '?'
        ),
        'key supplied is returned even when schemaKey is provided'
    );

    tt.true(
        is(
            reviver("", exampleMap).get('key'),
            'mySchemaKey'
        ),
        'returned key is schemaKey when no key is provided'
    );

    tt.true(
        is(
            DetermineReviverType((key, value) => value)('?', exampleMap),
            exampleMap
        ),
        'reviviers output is passed through constructor'
    );
});
