/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import ModuleIdentityDetailComponent, { ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import { getModuleIdentityTwinAction, GetModuleIdentityTwinActionParameters } from '../../actions';
import { getModuleIdentityTwinWrapperSelector } from '../../selectors';

const mapStateToProps = (state: StateType): ModuleIdentityDetailDataProps => {
    const moduleIdentityTwinWrapper = getModuleIdentityTwinWrapperSelector(state);
    return {
        moduleIdentityTwin: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.moduleIdentityTwin,
        synchronizationStatus: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.synchronizationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDetailDispatchProps => {
    return {
        getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => dispatch(getModuleIdentityTwinAction.started(params)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModuleIdentityDetailComponent);
