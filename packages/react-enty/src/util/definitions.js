/* @flow */

export type HockOptions = {
    group?: ?string,
    onMutateProp?: string,
    propChangeKeys: Array<string>,
    propUpdate: (Object) => Object,
    requestActionName?: string,
    updateResultKey: (string, Object) => string,
    resultKey?: string,
    schemaKey?: string,
    stateKey?: string
};

export type HockOptionsInput = {
    group?: ?string,
    onMutateProp?: string,
    propChangeKeys?: Array<string>,
    propUpdate?: (Object) => Object,
    requestActionName?: string,
    resultKey?: string,
    schemaKey?: string,
    stateKey?: string
};

export type SideEffect = (*, Object) => Promise<*>;
