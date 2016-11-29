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
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {object} entity map
 */
function selectEntity(state, resultKey) {
    var schemaKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ENTITY_RECEIVE';
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
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {object} entity map
 */
function selectEntityByPath(state, path) {
    var schemaKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ENTITY_RECEIVE';
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(path), entity, entity.getIn(['_schema', schemaKey])[path[0]]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FbnRpdHlTZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJzZWxlY3RFbnRpdHkiLCJzZWxlY3RFbnRpdHlCeVBhdGgiLCJzdGF0ZSIsInJlc3VsdEtleSIsInNjaGVtYUtleSIsImVudGl0eSIsImRhdGEiLCJnZXRJbiIsImlzSW5kZXhlZCIsInRvQXJyYXkiLCJ0b09iamVjdCIsInBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7O1FBV2dCQSxZLEdBQUFBLFk7UUFzQkFDLGtCLEdBQUFBLGtCOztBQWpDaEI7O0FBQ0E7O0FBR0E7Ozs7Ozs7QUFPTyxTQUFTRCxZQUFULENBQXNCRSxLQUF0QixFQUE2QkMsU0FBN0IsRUFBc0U7QUFBQSxRQUE5QkMsU0FBOEIsdUVBQWxCLGdCQUFrQjtBQUFBLFFBQ3BFQyxNQURvRSxHQUMxREgsS0FEMEQsQ0FDcEVHLE1BRG9FOztBQUV6RSxRQUFJQyxPQUFPLDhCQUNQRCxPQUFPRSxLQUFQLENBQWEsQ0FBQyxTQUFELEVBQVlKLFNBQVosQ0FBYixDQURPLEVBRVBFLE1BRk8sRUFHUEEsT0FBT0UsS0FBUCxDQUFhLENBQUMsU0FBRCxFQUFZSCxTQUFaLENBQWIsQ0FITyxDQUFYOztBQU1BLFFBQUdFLElBQUgsRUFBUztBQUNMLGVBQU8sb0JBQVNFLFNBQVQsQ0FBbUJGLElBQW5CLElBQTJCQSxLQUFLRyxPQUFMLEVBQTNCLEdBQTRDSCxLQUFLSSxRQUFMLEVBQW5EO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7Ozs7O0FBU08sU0FBU1Qsa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DUyxJQUFuQyxFQUF1RTtBQUFBLFFBQTlCUCxTQUE4Qix1RUFBbEIsZ0JBQWtCO0FBQUEsUUFDckVDLE1BRHFFLEdBQzNESCxLQUQyRCxDQUNyRUcsTUFEcUU7O0FBRTFFLFdBQU8sOEJBQ0hBLE9BQU9FLEtBQVAsQ0FBYUksSUFBYixDQURHLEVBRUhOLE1BRkcsRUFHSEEsT0FBT0UsS0FBUCxDQUFhLENBQUMsU0FBRCxFQUFZSCxTQUFaLENBQWIsRUFBcUNPLEtBQUssQ0FBTCxDQUFyQyxDQUhHLENBQVA7QUFLSCIsImZpbGUiOiJFbnRpdHlTZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZGVub3JtYWxpemV9IGZyb20gJ2Rlbm9ybWFsaXpyJztcbmltcG9ydCB7TWFwLCBJdGVyYWJsZX0gZnJvbSAnaW1tdXRhYmxlJztcblxuXG4vKipcbiAqIFRoZSBwcmltYXJ5IG1lYW5zIG9mIGFjY2Vzc2luZyBlbnRpdHkgc3RhdGUuIEdpdmVuIGEgcmVxdWVzdEtleSBpdCB3aWxsIHJldHVybiB0aGUgZGVub3JtYWxpemVkIHN0YXRlIG9iamVjdC5cbiAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVcbiAqIEBwYXJhbSAge3N0cmluZ30gcmVzdWx0S2V5XG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtzY2hlbWFLZXk9RU5USVRZX1JFQ0VJVkVdXG4gKiBAcmV0dXJuIHtvYmplY3R9IGVudGl0eSBtYXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdEVudGl0eShzdGF0ZSwgcmVzdWx0S2V5LCBzY2hlbWFLZXkgPSAnRU5USVRZX1JFQ0VJVkUnKSB7XG4gICAgdmFyIHtlbnRpdHl9ID0gc3RhdGU7XG4gICAgdmFyIGRhdGEgPSBkZW5vcm1hbGl6ZShcbiAgICAgICAgZW50aXR5LmdldEluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0pLFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIGVudGl0eS5nZXRJbihbJ19zY2hlbWEnLCBzY2hlbWFLZXldKVxuICAgICk7XG5cbiAgICBpZihkYXRhKSB7XG4gICAgICAgIHJldHVybiBJdGVyYWJsZS5pc0luZGV4ZWQoZGF0YSkgPyBkYXRhLnRvQXJyYXkoKSA6IGRhdGEudG9PYmplY3QoKTtcbiAgICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYSBwYXRoIHRvIGVudGl0eSBzdGF0ZSBpdCB3aWxsIHJldHVybiB0aGUgZGVub3JtYWxpemVkIHN0YXRlLlxuICogVGhpcyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgd2hlbiB5b3UgYXJlIGNlcnRhaW4geW91IG5lZWQgdGhlIGV4YWN0IGlkIGluIGVudGl0eSBzdGF0ZS5cbiAqIE1vc3Qgb2Z0ZW4gdGhlIHJlcXVlc3Qga2V5IGlzIG1vcmUgYXBwcm9wcmlhdGUuXG4gKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0gIHthcnJheX0gcGF0aFxuICogQHBhcmFtICB7c3RyaW5nfSBbc2NoZW1hS2V5PUVOVElUWV9SRUNFSVZFXVxuICogQHJldHVybiB7b2JqZWN0fSBlbnRpdHkgbWFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFbnRpdHlCeVBhdGgoc3RhdGUsIHBhdGgsIHNjaGVtYUtleSA9ICdFTlRJVFlfUkVDRUlWRScpIHtcbiAgICB2YXIge2VudGl0eX0gPSBzdGF0ZTtcbiAgICByZXR1cm4gZGVub3JtYWxpemUoXG4gICAgICAgIGVudGl0eS5nZXRJbihwYXRoKSxcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBlbnRpdHkuZ2V0SW4oWydfc2NoZW1hJywgc2NoZW1hS2V5XSlbcGF0aFswXV1cbiAgICApO1xufVxuIl19