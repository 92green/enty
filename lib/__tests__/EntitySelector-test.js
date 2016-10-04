'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _normalizr = require('normalizr');

var _immutable = require('immutable');

var _EntitySelector = require('../EntitySelector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constructState() {
    var FooSchema = new _normalizr.Schema('foo');
    var entitySchema = {
        fooList: (0, _normalizr.arrayOf)(FooSchema),
        foo: FooSchema
    };
    var normalized = (0, _normalizr.normalize)({
        single: { foo: { id: 'qux' } },
        fooList: [{ id: 'bar' }, { id: 'baz' }]
    }, entitySchema);

    return {
        entity: (0, _immutable.fromJS)(_extends({}, normalized.entities, {
            _result: normalized.result,
            _schema: {
                mainSchema: entitySchema,
                otherSchema: entitySchema,
                fooList: entitySchema.fooList
            }
        }))
    };
}

(0, _ava2.default)('selectEntity', function (tt) {
    tt.truthy((0, _EntitySelector.selectEntity)(constructState(), 'single').foo, 'it should return a map for single items');
    tt.is((0, _EntitySelector.selectEntity)(constructState(), 'fooList', 'fooList').length, 2, 'it should return an array for indexed items');
    tt.is((0, _EntitySelector.selectEntity)({ entity: (0, _immutable.fromJS)({}) }), undefined, 'it should return nothing if the denormalize fails');
});

(0, _ava2.default)('selectEntityByPath', function (tt) {
    tt.is((0, _EntitySelector.selectEntityByPath)(constructState(), ['foo', 'bar'], 'otherSchema').get('id'), 'bar', 'it should an item from entity state by path');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vRW50aXR5U2VsZWN0b3ItdGVzdC5qcyJdLCJuYW1lcyI6WyJjb25zdHJ1Y3RTdGF0ZSIsIkZvb1NjaGVtYSIsImVudGl0eVNjaGVtYSIsImZvb0xpc3QiLCJmb28iLCJub3JtYWxpemVkIiwic2luZ2xlIiwiaWQiLCJlbnRpdHkiLCJlbnRpdGllcyIsIl9yZXN1bHQiLCJyZXN1bHQiLCJfc2NoZW1hIiwibWFpblNjaGVtYSIsIm90aGVyU2NoZW1hIiwidHQiLCJ0cnV0aHkiLCJpcyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFHQSxTQUFTQSxjQUFULEdBQTBCO0FBQ3RCLFFBQUlDLFlBQVksc0JBQVcsS0FBWCxDQUFoQjtBQUNBLFFBQUlDLGVBQWU7QUFDZkMsaUJBQVMsd0JBQVFGLFNBQVIsQ0FETTtBQUVmRyxhQUFLSDtBQUZVLEtBQW5CO0FBSUEsUUFBSUksYUFBYSwwQkFDYjtBQUNJQyxnQkFBUSxFQUFDRixLQUFLLEVBQUNHLElBQUksS0FBTCxFQUFOLEVBRFo7QUFFSUosaUJBQVMsQ0FBQyxFQUFDSSxJQUFJLEtBQUwsRUFBRCxFQUFjLEVBQUNBLElBQUksS0FBTCxFQUFkO0FBRmIsS0FEYSxFQUtiTCxZQUxhLENBQWpCOztBQVFBLFdBQU87QUFDSE0sZ0JBQVEsb0NBQ0RILFdBQVdJLFFBRFY7QUFFSkMscUJBQVNMLFdBQVdNLE1BRmhCO0FBR0pDLHFCQUFTO0FBQ0xDLDRCQUFZWCxZQURQO0FBRUxZLDZCQUFhWixZQUZSO0FBR0xDLHlCQUFTRCxhQUFhQztBQUhqQjtBQUhMO0FBREwsS0FBUDtBQVdIOztBQUdELG1CQUFLLGNBQUwsRUFBcUIsY0FBTTtBQUN2QlksT0FBR0MsTUFBSCxDQUFVLGtDQUFhaEIsZ0JBQWIsRUFBK0IsUUFBL0IsRUFBeUNJLEdBQW5ELEVBQXdELHlDQUF4RDtBQUNBVyxPQUFHRSxFQUFILENBQU0sa0NBQWFqQixnQkFBYixFQUErQixTQUEvQixFQUEwQyxTQUExQyxFQUFxRGtCLE1BQTNELEVBQW1FLENBQW5FLEVBQXNFLDZDQUF0RTtBQUNBSCxPQUFHRSxFQUFILENBQU0sa0NBQWEsRUFBQ1QsUUFBUSx1QkFBTyxFQUFQLENBQVQsRUFBYixDQUFOLEVBQTBDVyxTQUExQyxFQUFxRCxtREFBckQ7QUFDSCxDQUpEOztBQU1BLG1CQUFLLG9CQUFMLEVBQTJCLGNBQU07QUFDN0JKLE9BQUdFLEVBQUgsQ0FBTSx3Q0FBbUJqQixnQkFBbkIsRUFBcUMsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFyQyxFQUFxRCxhQUFyRCxFQUFvRW9CLEdBQXBFLENBQXdFLElBQXhFLENBQU4sRUFBcUYsS0FBckYsRUFBNEYsNkNBQTVGO0FBQ0gsQ0FGRCIsImZpbGUiOiJFbnRpdHlTZWxlY3Rvci10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJztcbmltcG9ydCB7U2NoZW1hLCBhcnJheU9mfSBmcm9tICdub3JtYWxpenInO1xuaW1wb3J0IHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQge3NlbGVjdEVudGl0eSwgc2VsZWN0RW50aXR5QnlQYXRofSBmcm9tICcuLi9FbnRpdHlTZWxlY3Rvcic7XG5pbXBvcnQge25vcm1hbGl6ZX0gZnJvbSAnbm9ybWFsaXpyJztcblxuZnVuY3Rpb24gY29uc3RydWN0U3RhdGUoKSB7XG4gICAgdmFyIEZvb1NjaGVtYSA9IG5ldyBTY2hlbWEoJ2ZvbycpO1xuICAgIHZhciBlbnRpdHlTY2hlbWEgPSB7XG4gICAgICAgIGZvb0xpc3Q6IGFycmF5T2YoRm9vU2NoZW1hKSxcbiAgICAgICAgZm9vOiBGb29TY2hlbWFcbiAgICB9XG4gICAgdmFyIG5vcm1hbGl6ZWQgPSBub3JtYWxpemUoXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNpbmdsZToge2Zvbzoge2lkOiAncXV4J319LFxuICAgICAgICAgICAgZm9vTGlzdDogW3tpZDogJ2Jhcid9LCB7aWQ6ICdiYXonfV1cbiAgICAgICAgfSxcbiAgICAgICAgZW50aXR5U2NoZW1hXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGVudGl0eTogZnJvbUpTKHtcbiAgICAgICAgICAgIC4uLm5vcm1hbGl6ZWQuZW50aXRpZXMsXG4gICAgICAgICAgICBfcmVzdWx0OiBub3JtYWxpemVkLnJlc3VsdCxcbiAgICAgICAgICAgIF9zY2hlbWE6IHtcbiAgICAgICAgICAgICAgICBtYWluU2NoZW1hOiBlbnRpdHlTY2hlbWEsXG4gICAgICAgICAgICAgICAgb3RoZXJTY2hlbWE6IGVudGl0eVNjaGVtYSxcbiAgICAgICAgICAgICAgICBmb29MaXN0OiBlbnRpdHlTY2hlbWEuZm9vTGlzdFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG50ZXN0KCdzZWxlY3RFbnRpdHknLCB0dCA9PiB7XG4gICAgdHQudHJ1dGh5KHNlbGVjdEVudGl0eShjb25zdHJ1Y3RTdGF0ZSgpLCAnc2luZ2xlJykuZm9vLCAnaXQgc2hvdWxkIHJldHVybiBhIG1hcCBmb3Igc2luZ2xlIGl0ZW1zJyk7XG4gICAgdHQuaXMoc2VsZWN0RW50aXR5KGNvbnN0cnVjdFN0YXRlKCksICdmb29MaXN0JywgJ2Zvb0xpc3QnKS5sZW5ndGgsIDIsICdpdCBzaG91bGQgcmV0dXJuIGFuIGFycmF5IGZvciBpbmRleGVkIGl0ZW1zJyk7XG4gICAgdHQuaXMoc2VsZWN0RW50aXR5KHtlbnRpdHk6IGZyb21KUyh7fSl9KSwgdW5kZWZpbmVkLCAnaXQgc2hvdWxkIHJldHVybiBub3RoaW5nIGlmIHRoZSBkZW5vcm1hbGl6ZSBmYWlscycpO1xufSk7XG5cbnRlc3QoJ3NlbGVjdEVudGl0eUJ5UGF0aCcsIHR0ID0+IHtcbiAgICB0dC5pcyhzZWxlY3RFbnRpdHlCeVBhdGgoY29uc3RydWN0U3RhdGUoKSwgWydmb28nLCAnYmFyJ10sICdvdGhlclNjaGVtYScpLmdldCgnaWQnKSwgJ2JhcicsICdpdCBzaG91bGQgYW4gaXRlbSBmcm9tIGVudGl0eSBzdGF0ZSBieSBwYXRoJyk7XG59KTtcbiJdfQ==