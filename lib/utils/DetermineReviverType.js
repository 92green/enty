'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = DetermineReviverType;

var _immutable = require('immutable');

function DetermineReviverType(constructor, schemaKey) {
    return function (key, value) {
        // Check if the value is an array or object and convert to that for them.
        var isIndexed = _immutable.Iterable.isIndexed(value);
        var returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(key || schemaKey, returnValue);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9EZXRlcm1pbmVSZXZpdmVyVHlwZS5qcyJdLCJuYW1lcyI6WyJEZXRlcm1pbmVSZXZpdmVyVHlwZSIsImNvbnN0cnVjdG9yIiwic2NoZW1hS2V5Iiwia2V5IiwidmFsdWUiLCJpc0luZGV4ZWQiLCJyZXR1cm5WYWx1ZSIsInRvTGlzdCIsInRvTWFwIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFFd0JBLG9COztBQUZ4Qjs7QUFFZSxTQUFTQSxvQkFBVCxDQUE4QkMsV0FBOUIsRUFBMkNDLFNBQTNDLEVBQXNEO0FBQ2pFLFdBQU8sVUFBQ0MsR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQ25CO0FBQ0EsWUFBTUMsWUFBWSxvQkFBU0EsU0FBVCxDQUFtQkQsS0FBbkIsQ0FBbEI7QUFDQSxZQUFNRSxjQUFjRCxZQUFZRCxNQUFNRyxNQUFOLEVBQVosR0FBNkJILE1BQU1JLEtBQU4sRUFBakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBT1AsWUFBWUUsT0FBT0QsU0FBbkIsRUFBOEJJLFdBQTlCLENBQVA7QUFDSCxLQVREO0FBVUgiLCJmaWxlIjoiRGV0ZXJtaW5lUmV2aXZlclR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0l0ZXJhYmxlfSBmcm9tICdpbW11dGFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEZXRlcm1pbmVSZXZpdmVyVHlwZShjb25zdHJ1Y3Rvciwgc2NoZW1hS2V5KSB7XG4gICAgcmV0dXJuIChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSB2YWx1ZSBpcyBhbiBhcnJheSBvciBvYmplY3QgYW5kIGNvbnZlcnQgdG8gdGhhdCBmb3IgdGhlbS5cbiAgICAgICAgY29uc3QgaXNJbmRleGVkID0gSXRlcmFibGUuaXNJbmRleGVkKHZhbHVlKTtcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSBpc0luZGV4ZWQgPyB2YWx1ZS50b0xpc3QoKSA6IHZhbHVlLnRvTWFwKCk7XG5cbiAgICAgICAgLy8gdGhlIGtleSBmcm9tIHRoZSBzY2hlbWEgaXMgdXNlZCBpZiBrZXkgaXMgdW5kZWZpbmVkXG4gICAgICAgIC8vIHRoaXMgaXMgb25seSB0aGUgY2FzZSBpZiB3ZSBhcmUgYXQgdGhlIHRvcCBsZXZlbCBvZiBvdXIgcGF5bG9hZFxuICAgICAgICAvLyB0aGF0IHdheSB0aGUgcmV2aXZlciBnZXRzIGtub3dsZWdlIG9mIHdoYXQgdHlwZSBvZiBzY2hlbWEgd2UgYXJlIHVzaW5nXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcihrZXkgfHwgc2NoZW1hS2V5LCByZXR1cm5WYWx1ZSk7XG4gICAgfVxufVxuIl19