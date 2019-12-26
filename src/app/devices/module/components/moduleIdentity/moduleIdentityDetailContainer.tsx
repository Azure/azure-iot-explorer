/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import ModuleIdentityDetailComponent, { ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import { getModuleIdentityTwinAction, GetModuleIdentityTwinActionParameters, GetModuleIdentityActionParameters, getModuleIdentityAction } from '../../actions';
import { getModuleIdentityTwinWrapperSelector, getModuleIdentityWrapperSelector } from '../../selectors';

const mapStateToProps = (state: StateType): ModuleIdentityDetailDataProps => {
    const moduleIdentityTwinWrapper = getModuleIdentityTwinWrapperSelector(state);
    const moduleIdentityWrapper = getModuleIdentityWrapperSelector(state);
    return {
        moduleIdentity: moduleIdentityWrapper && moduleIdentityWrapper.moduleIdentity,
        moduleIdentitySyncStatus: moduleIdentityWrapper && moduleIdentityWrapper.synchronizationStatus,
        moduleIdentityTwin: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.moduleIdentityTwin,
        moduleIdentityTwinSyncStatus: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.synchronizationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDetailDispatchProps => {
    return {
        getModuleIdentity: (params: GetModuleIdentityActionParameters) => dispatch(getModuleIdentityAction.started(params)),
        getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => dispatch(getModuleIdentityTwinAction.started(params))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModuleIdentityDetailComponent);
