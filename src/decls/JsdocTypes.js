/* @flow */
/* eslint-disable no-unused-vars */

/**
 * @callback EntityQueryHockFactory
 *
 * @param {QueryCreator} queryCreator
 *
 * @param {string[]} [propUpdateKeys]
 * Description
 *
 * @param {object} [metaOverride]
 * Description
 *
 * @returns {EntityQueryHockApplier}
 */

/**
 * @callback EntityQueryHockApplier
 *
 * @param {Component} componentToDecorate
 *
 * @returns {Component}
 */


/**
 * QueryCreator Description
 *
 * @callback QueryCreator
 *
 * @param {object} [props]
 * Description
 *
 * @param {object} [state]
 * Description
 *
 */

/**
 * Configuration options passed to selectors for accessing state. (Basic uses cases wont need this)
 *
 * @typedef {object} SelectOptions
 * @property {string} [schemaKey=ENTITY_RECEIVE]
 * @property {string} [stateKey=entity] - redux key to store entity state at.
 */

/**
 * Entity Api object shape
 *
 * @typedef {object} EntityApi
 * @property {ReduxStore} EntityStore
 * @property {ReduxReducer} EntityReducer
 * @property {QueryHock} <Key>QueryHock
 * @property {MutationHock} <Key>MutationHock
 * @property {function} <key> Action Creator
 * @property {string} <key>.actionTypes.<KEY>_FETCH
 * @property {string} <key>.actionTypes.<KEY>_RECEIVE
 * @property {string} <key>.actionTypes.<KEY>_ERROR
 */



// externals

/**
 * Immutable.js Iterable
 * @typedef Iterable
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Iterable
 */

/**
 * Immutable.js List
 * @typedef List
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/List
 */

/**
 * Immutable.js Map
 * @typedef Map
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Map
 */

/**
 * Immutable.js OrderedMap
 * @typedef OrderedMap
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/OrderedMap
 */

/**
 * Immutable.js Record
 * @typedef Record
 * @noexpand
 * @see https://facebook.github.io/immutable-js/docs/#/Record
 */

/**
 * React Component
 * @typedef ReactComponent
 * @noexpand
 * @see https://facebook.github.io/react/docs/react-component.html
 */

/**
 * React Element
 * @typedef ReactElement
 * @noexpand
 * @see https://facebook.github.io/react/docs/react-component.html
 */
