'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = DetermineReviverType;

var _immutable = require('immutable');

function DetermineReviverType(constructor, schemaKey) {
    // Immutable's fromJS has a backwards syntax. We flip this when calling constructor
    // to maintain the similarity to map so that beforeNormalize and after normalize can
    // have the same signature.
    return function (key, value) {
        // Check if the value is an array or object and convert to that for them.
        var isIndexed = _immutable.Iterable.isIndexed(value);
        var returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(returnValue, key || schemaKey);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9EZXRlcm1pbmVSZXZpdmVyVHlwZS5qcyJdLCJuYW1lcyI6WyJEZXRlcm1pbmVSZXZpdmVyVHlwZSIsImNvbnN0cnVjdG9yIiwic2NoZW1hS2V5Iiwia2V5IiwidmFsdWUiLCJpc0luZGV4ZWQiLCJyZXR1cm5WYWx1ZSIsInRvTGlzdCIsInRvTWFwIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFFd0JBLG9COztBQUZ4Qjs7QUFFZSxTQUFTQSxvQkFBVCxDQUE4QkMsV0FBOUIsRUFBMkNDLFNBQTNDLEVBQXNEO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLFdBQU8sVUFBQ0MsR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQ25CO0FBQ0EsWUFBTUMsWUFBWSxvQkFBU0EsU0FBVCxDQUFtQkQsS0FBbkIsQ0FBbEI7QUFDQSxZQUFNRSxjQUFjRCxZQUFZRCxNQUFNRyxNQUFOLEVBQVosR0FBNkJILE1BQU1JLEtBQU4sRUFBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBT1AsWUFBWUssV0FBWixFQUF5QkgsT0FBT0QsU0FBaEMsQ0FBUDtBQUNILEtBVEQ7QUFVSCIsImZpbGUiOiJEZXRlcm1pbmVSZXZpdmVyVHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SXRlcmFibGV9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERldGVybWluZVJldml2ZXJUeXBlKGNvbnN0cnVjdG9yLCBzY2hlbWFLZXkpIHtcbiAgICAvLyBJbW11dGFibGUncyBmcm9tSlMgaGFzIGEgYmFja3dhcmRzIHN5bnRheC4gV2UgZmxpcCB0aGlzIHdoZW4gY2FsbGluZyBjb25zdHJ1Y3RvclxuICAgIC8vIHRvIG1haW50YWluIHRoZSBzaW1pbGFyaXR5IHRvIG1hcCBzbyB0aGF0IGJlZm9yZU5vcm1hbGl6ZSBhbmQgYWZ0ZXIgbm9ybWFsaXplIGNhblxuICAgIC8vIGhhdmUgdGhlIHNhbWUgc2lnbmF0dXJlLlxuICAgIHJldHVybiAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXkgb3Igb2JqZWN0IGFuZCBjb252ZXJ0IHRvIHRoYXQgZm9yIHRoZW0uXG4gICAgICAgIGNvbnN0IGlzSW5kZXhlZCA9IEl0ZXJhYmxlLmlzSW5kZXhlZCh2YWx1ZSk7XG4gICAgICAgIGNvbnN0IHJldHVyblZhbHVlID0gaXNJbmRleGVkID8gdmFsdWUudG9MaXN0KCkgOiB2YWx1ZS50b01hcCgpO1xuXG4gICAgICAgIC8vIHRoZSBrZXkgZnJvbSB0aGUgc2NoZW1hIGlzIHVzZWQgaWYga2V5IGlzIHVuZGVmaW5lZFxuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgdGhlIGNhc2UgaWYgd2UgYXJlIGF0IHRoZSB0b3AgbGV2ZWwgb2Ygb3VyIHBheWxvYWRcbiAgICAgICAgLy8gdGhhdCB3YXkgdGhlIHJldml2ZXIgZ2V0cyBrbm93bGVnZSBvZiB3aGF0IHR5cGUgb2Ygc2NoZW1hIHdlIGFyZSB1c2luZ1xuICAgICAgICByZXR1cm4gY29uc3RydWN0b3IocmV0dXJuVmFsdWUsIGtleSB8fCBzY2hlbWFLZXkpO1xuICAgIH1cbn1cbiJdfQ==