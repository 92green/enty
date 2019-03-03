// @flow

export default function isObservable(obj: any): boolean %checks {
    return typeof obj.lift === 'function' && typeof obj.subscribe === 'function';
}
