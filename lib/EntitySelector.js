'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectEntity = selectEntity;
exports.selectEntityByPath = selectEntityByPath;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

/**
 * The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.
 * @param  {object} state
 * @param  {string} resultKey
 * @param  {string} [schemaKey=mainSchema]
 * @return {object} entity map
 */
function selectEntity(state, resultKey) {
    var schemaKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'mainSchema';
    var entity = state.entity;

    var data = (0, _denormalizr.denormalize)(entity.getIn(['_result', resultKey]), entity, entity.getIn(['_schema', schemaKey]));

    if (data) {
        return _immutable.Iterable.isIndexed(data) ? data.toArray() : data.toObject();
    }
}

/**
 * Given a path to entity state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 * @param  {object} state
 * @param  {array} path
 * @param  {string} [schemaKey=mainSchema]
 * @return {object} entity map
 */
function selectEntityByPath(state, path) {
    var schemaKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'mainSchema';
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(path), entity, entity.getIn(['_schema', schemaKey, path[0]]));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FbnRpdHlTZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJzZWxlY3RFbnRpdHkiLCJzZWxlY3RFbnRpdHlCeVBhdGgiLCJzdGF0ZSIsInJlc3VsdEtleSIsInNjaGVtYUtleSIsImVudGl0eSIsImRhdGEiLCJnZXRJbiIsImlzSW5kZXhlZCIsInRvQXJyYXkiLCJ0b09iamVjdCIsInBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7O1FBV2dCQSxZLEdBQUFBLFk7UUFzQkFDLGtCLEdBQUFBLGtCOztBQWpDaEI7O0FBQ0E7O0FBR0E7Ozs7Ozs7QUFPTyxTQUFTRCxZQUFULENBQXNCRSxLQUF0QixFQUE2QkMsU0FBN0IsRUFBa0U7QUFBQSxRQUExQkMsU0FBMEIsdUVBQWQsWUFBYztBQUFBLFFBQ2hFQyxNQURnRSxHQUN0REgsS0FEc0QsQ0FDaEVHLE1BRGdFOztBQUVyRSxRQUFJQyxPQUFPLDhCQUNQRCxPQUFPRSxLQUFQLENBQWEsQ0FBQyxTQUFELEVBQVlKLFNBQVosQ0FBYixDQURPLEVBRVBFLE1BRk8sRUFHUEEsT0FBT0UsS0FBUCxDQUFhLENBQUMsU0FBRCxFQUFZSCxTQUFaLENBQWIsQ0FITyxDQUFYOztBQU1BLFFBQUdFLElBQUgsRUFBUztBQUNMLGVBQU8sb0JBQVNFLFNBQVQsQ0FBbUJGLElBQW5CLElBQTJCQSxLQUFLRyxPQUFMLEVBQTNCLEdBQTRDSCxLQUFLSSxRQUFMLEVBQW5EO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU08sU0FBU1Qsa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DUyxJQUFuQyxFQUFtRTtBQUFBLFFBQTFCUCxTQUEwQix1RUFBZCxZQUFjO0FBQUEsUUFDakVDLE1BRGlFLEdBQ3ZESCxLQUR1RCxDQUNqRUcsTUFEaUU7O0FBRXRFLFdBQU8sOEJBQ0hBLE9BQU9FLEtBQVAsQ0FBYUksSUFBYixDQURHLEVBRUhOLE1BRkcsRUFHSEEsT0FBT0UsS0FBUCxDQUFhLENBQUMsU0FBRCxFQUFZSCxTQUFaLEVBQXVCTyxLQUFLLENBQUwsQ0FBdkIsQ0FBYixDQUhHLENBQVA7QUFLSCIsImZpbGUiOiJFbnRpdHlTZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVub3JtYWxpemV9IGZyb20gJ2Rlbm9ybWFsaXpyJztcbmltcG9ydCB7TWFwLCBJdGVyYWJsZX0gZnJvbSAnaW1tdXRhYmxlJztcblxuXG4vKipcbiAqIFRoZSBwcmltYXJ5IG1lYW5zIG9mIGFjY2Vzc2luZyBlbnRpdHkgc3RhdGUuIEdpdmVuIGEgcmVxdWVzdEtleSBpdCB3aWxsIHJldHVybiB0aGUgZGVub3JtYWxpemVkIHN0YXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSAge3N0cmluZ30gcmVzdWx0S2V5XG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtzY2hlbWFLZXk9bWFpblNjaGVtYV1cbiAqIEByZXR1cm4ge29iamVjdH0gZW50aXR5IG1hcFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0RW50aXR5KHN0YXRlLCByZXN1bHRLZXksIHNjaGVtYUtleSA9ICdtYWluU2NoZW1hJykge1xuICAgIHZhciB7ZW50aXR5fSA9IHN0YXRlO1xuICAgIHZhciBkYXRhID0gZGVub3JtYWxpemUoXG4gICAgICAgIGVudGl0eS5nZXRJbihbJ19yZXN1bHQnLCByZXN1bHRLZXldKSxcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBlbnRpdHkuZ2V0SW4oWydfc2NoZW1hJywgc2NoZW1hS2V5XSlcbiAgICApO1xuXG4gICAgaWYoZGF0YSkge1xuICAgICAgICByZXR1cm4gSXRlcmFibGUuaXNJbmRleGVkKGRhdGEpID8gZGF0YS50b0FycmF5KCkgOiBkYXRhLnRvT2JqZWN0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIEdpdmVuIGEgcGF0aCB0byBlbnRpdHkgc3RhdGUgaXQgd2lsbCByZXR1cm4gdGhlIGRlbm9ybWFsaXplZCBzdGF0ZS5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgb25seSB1c2VkIHdoZW4geW91IGFyZSBjZXJ0YWluIHlvdSBuZWVkIHRoZSBleGFjdCBpZCBpbiBlbnRpdHkgc3RhdGUuXG4gKiBNb3N0IG9mdGVuIHRoZSByZXF1ZXN0IGtleSBpcyBtb3JlIGFwcHJvcHJpYXRlLlxuICogQHBhcmFtICB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtICB7YXJyYXl9IHBhdGhcbiAqIEBwYXJhbSAge3N0cmluZ30gW3NjaGVtYUtleT1tYWluU2NoZW1hXVxuICogQHJldHVybiB7b2JqZWN0fSBlbnRpdHkgbWFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFbnRpdHlCeVBhdGgoc3RhdGUsIHBhdGgsIHNjaGVtYUtleSA9ICdtYWluU2NoZW1hJykge1xuICAgIHZhciB7ZW50aXR5fSA9IHN0YXRlO1xuICAgIHJldHVybiBkZW5vcm1hbGl6ZShcbiAgICAgICAgZW50aXR5LmdldEluKHBhdGgpLFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIGVudGl0eS5nZXRJbihbJ19zY2hlbWEnLCBzY2hlbWFLZXksIHBhdGhbMF1dKVxuICAgICk7XG59XG4iXX0=