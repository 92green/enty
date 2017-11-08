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

export type SelectOptions = {
    schemaKey?: string,
    stateKey?: string
};
