// @flow

export default function isObservable(obj: any): boolean %checks {
    return typeof obj.subscribe === 'function';
}
