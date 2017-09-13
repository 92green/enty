/* @flow */
/* eslint-disable no-unused-vars */

import {Map} from 'immutable';

export type NormalizeState = {
    entities: Object|Map<any, any>,
    result: Object,
    schemas: Object
};


type DenormalizeState = {
    entities: Object|Map<any, any>,
    result: Object|Map<any, any>
};

export type SelectOptions = {
    schemaKey?: string,
    stateKey?: string
};
