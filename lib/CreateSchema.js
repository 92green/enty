'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSchema = createSchema;

var _normalizr = require('normalizr');

function createSchema(key) {
    var id = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];
    var defaults = arguments[2];

    return new _normalizr.Schema(key, {
        idAttribute: id,
        defaults: defaults
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVTY2hlbWEuanMiXSwibmFtZXMiOlsiY3JlYXRlU2NoZW1hIiwia2V5IiwiaWQiLCJkZWZhdWx0cyIsImlkQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiOzs7OztRQUVnQkEsWSxHQUFBQSxZOztBQUZoQjs7QUFFTyxTQUFTQSxZQUFULENBQXNCQyxHQUF0QixFQUFnRDtBQUFBLFFBQXJCQyxFQUFxQix5REFBaEIsSUFBZ0I7QUFBQSxRQUFWQyxRQUFVOztBQUNuRCxXQUFPLHNCQUFXRixHQUFYLEVBQWdCO0FBQ25CRyxxQkFBYUYsRUFETTtBQUVuQkM7QUFGbUIsS0FBaEIsQ0FBUDtBQUlIIiwiZmlsZSI6IkNyZWF0ZVNjaGVtYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U2NoZW1hfSBmcm9tICdub3JtYWxpenInO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2NoZW1hKGtleSwgaWQgPSAnaWQnLCBkZWZhdWx0cykge1xuICAgIHJldHVybiBuZXcgU2NoZW1hKGtleSwge1xuICAgICAgICBpZEF0dHJpYnV0ZTogaWQsXG4gICAgICAgIGRlZmF1bHRzXG4gICAgfSk7XG59XG4iXX0=