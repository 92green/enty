import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';

import PropChangeHock from './PropChangeHock'

export const connectWithQuery = (connector, query, propChangeList) => (ComposedComponent) => {

    const reduxConnect = connect(connector);
    const propChangeListener = PropChangeHock(propChangeList, query);

    return reduxConnect(propChangeListener(ComposedComponent))
}
