import test from 'ava';
import CreateEntityQuery from '../CreateEntityQuery';



test('CreateEntityQuery', tt => {
    var action = () => {};
    var queryCreator = () => `query`;

    var entityQuery = CreateEntityQuery(action);
    var hockedComponent = entityQuery(queryCreator, ['keys']);

    tt.is(typeof entityQuery, 'function', 'it should return a function');
    tt.is(typeof hockedComponent, 'function' , 'its hockedComponent should be a function');
});
