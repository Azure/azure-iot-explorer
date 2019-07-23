/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StateType } from '../redux/state';
import Breadcrumb from './breadcrumb';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

const mapStateToProps = (state: StateType) => {
    const connectionInfo = state.connectionState && state.connectionState.connectionString && getConnectionInfoFromConnectionString(state.connectionState.connectionString);
    return {
        hubName: connectionInfo && connectionInfo.hostName
    };
};

export default compose(withRouter, connect(mapStateToProps))(Breadcrumb);
