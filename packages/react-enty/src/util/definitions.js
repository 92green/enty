/* @flow */
import type {ComponentType} from 'react';
import type Message from '../data/Message';

/**
 * HockOptions description
 *
 */
export type HockOptions = {
    group: string,
    onMutateProp?: string,
    propChangeKeys: Array<string>,
    propUpdate: (Object) => Object,
    requestActionName: string,
    updateResultKey: (string, Object) => string,
    resultKey?: string,
    schemaKey?: string,
    stateKey?: string
};

/**
 * HockOptionsInput description
 */
export type HockOptionsInput = {
    group?: string,
    onMutateProp?: string,
    propChangeKeys?: Array<string>,
    propUpdate?: (props: Object) => Object,
    requestActionName?: string,
    resultKey?: string,
    schemaKey?: string,
    storeKey?: string,
    stateKey?: string
};

export type AutoHockConfig = {
    // Required name to isolate data when passing through props
    name: string,

    // Auto call the request on page load and prop change
    // if true, request on the first render
    // if array of strings, request on the first render and each time one of the props changes
    auto?: boolean|Array<string>,

    // If auto requesting is enabled, this hook lets you cancel the request based on props.
    shouldComponentAutoRequest?: (props: *) => boolean
};

export type RequestHockConfigInput = {
    // Required name to isolate data when passing through props
    name: string,

    // Auto call the request on page load and prop change
    // if true, request on the first render
    // if array of strings, request on the first render and each time one of the props changes
    auto?: boolean|Array<string>,

    // If auto requesting is enabled, this hook lets you cancel the request based on props.
    shouldComponentAutoRequest?: (props: *) => boolean,

    // function to map props to your api payload
    payloadCreator?: (props: *) => *,

    // Double-barrelled function to update the message before it is given
    // to the child component
    pipe?: (props: *) => (message: Message) => Message,

    // thunk to amend the result key based on props, used when you only have one instance of hock,
    // but it is invoked in various ways.
    //
    // @TODO: check how this plays out with request states and propKeys
    updateResultKey?: (resultKey: string, props: *) => string,

    // custom hardcoded resultKey
    resultKey?: string,

    // Function to map response back and then spread it back onto props.
    // Useful for when you don't wish to fish the response out of the request message.
    mapResponseToProps?: boolean|Object => Object

};

/**
 * This is the same as RequestHockConfigInput, but mapResponseToProps will now always return an object
 * allowing for it to always be spread
 */
export type RequestHockConfig = {
    name: string,
    payloadCreator?: (props: *) => *,
    updateResultKey?: (resultKey: string, props: *) => string,
    resultKey?: string,
    mapResponseToProps: Object => Object,
    auto?: boolean|Array<string>,
    shouldComponentAutoRequest?: (props: *) => boolean,
    pipe: (props: *) => (message: Message) => Message
};

/**
 * MultiRequestHockConfig description
 */
export type MultiRequestHockConfig = {
    onRequest: (props: *) => Promise<*>,
    name: string,
    auto?: boolean|Array<string>,
    shouldComponentAutoRequest?: (props: *) => boolean
};

export type ActionMeta = {
    resultKey: string
};

export type HockMeta = {
    generateResultKey: (payload: *) => string,
    requestActionName: string,
    storeKey?: string,
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
