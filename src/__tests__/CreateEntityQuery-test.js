import test from 'ava';
import CreateEntityQuery from '../CreateEntityQuery';



test('CreateEntityQuery', tt => {
    var action = () => {};
    var queryCreator = () => `query`;

    var entityQuery = CreateEntityQuery(action);
    var hockedComponent = entityQuery(queryCreator, ['keys']);
    var runTheHock = hockedComponent();
    tt.is(typeof entityQuery, 'function', 'it should return a function');
    tt.is(typeof hockedComponent, 'function' , 'its hockedComponent should be a function');
    tt.is(runTheHock.displayName, 'Connect(AutoRequest)' , 'The hocked component should be an auto request');
});
