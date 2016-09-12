
import {createEntityQuery, createAction} from 'redux-blueflag';
import request from 'superagent';

function post(url, query) {
    return new Promise((resolve, reject) => {
        request
            .post(url)
            .send(query)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/graphql')
            .end((err, response) => {
                if(!response) {
                    reject(err);
                } else if (response.ok) {
                    resolve(response.body, response);
                } else {
                    reject(response);
                }
            });
    });
}

const graphqlFetch = createAction('GRAPHQL_FETCH');
const graphqlReceive = createAction('GRAPHQL_RECEIVE', payload => payload, (payload, resultKey) => ({resultKey}));
const graphqlError = createAction('GRAPHQL_ERROR');

export const entityQuery = createEntityQuery((query, {resultKey}) => {
    return (dispatch) => {
        var flatQuery = query
            .split('\n')
            .map(qq => qq.trim())
            .join(' ')
            .trim();

        dispatch(graphqlFetch());
        post('/graphql', flatQuery).then(
            payload => dispatch(graphqlReceive(payload.data, resultKey)),
            error => dispatch(graphqlError(error))
        )
    }
});
