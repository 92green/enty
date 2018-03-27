/* @flow */
import type {ComponentType} from 'react';

/**
 * HockOptions description
 *
 */
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

/**
 * HockOptionsInput description
 */
export type HockOptionsInput = {
    group?: ?string,
    onMutateProp?: string,
    propChangeKeys?: Array<string>,
    propUpdate?: (props: Object) => Object,
    requestActionName?: string,
    resultKey?: string,
    schemaKey?: string,
    stateKey?: string
};

/**
 * HockApplier description
 */
export type HockApplier = (Component: ComponentType<any>) => ComponentType<any>;

/**
 * Hock description
 *
 */
export type Hock = (...args: *) => HockApplier;

/**
 * SideEffect description
 */
export type SideEffect = (*, Object) => Promise<*>;
