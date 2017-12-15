/* @flow */
/* eslint-disable no-unused-vars */

import {Map} from 'immutable';

export type NormalizeState = {
    entities: Object,
    result: any,
    schemas: Object
};


export type DenormalizeState = {
    entities: Object,
    result: any
};

export type HockOptions = {
    group?: ?string,
    onMutateProp?: string,
    propChangeKeys: Array<string>,
    propUpdate: (Object) => Object,
    requestActionName?: string,
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

