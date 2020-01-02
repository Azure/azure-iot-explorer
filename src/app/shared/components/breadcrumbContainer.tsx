/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StateType } from '../redux/state';
import Breadcrumb from './breadcrumb';

const mapStateToProps = (state: StateType) => {
    return {
        hubName: state.azureResourceState.activeAzureResource ? state.azureResourceState.activeAzureResource.hostName : ''
    };
};

export default compose(withRouter, connect(mapStateToProps))(Breadcrumb);
