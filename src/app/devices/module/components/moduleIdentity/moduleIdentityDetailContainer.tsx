/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import ModuleIdentityDetailComponent, { ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import {
    getModuleIdentityTwinAction,
    GetModuleIdentityTwinActionParameters,
    getModuleIdentityAction,
    GetModuleIdentityActionParameters,
    deleteModuleIdentityAction,
    DeleteModuleIdentityActionParameters
} from '../../actions';
import {
    getModuleIdentityTwinWrapperSelector,
    getModuleIdentityWrapperSelector,
    getModuleIdentityListSyncStatusSelector
} from '../../selectors';
import { getActiveAzureResourceHostNameSelector } from '../../../../azureResource/selectors';

const mapStateToProps = (state: StateType): ModuleIdentityDetailDataProps => {
    const moduleIdentityTwinWrapper = getModuleIdentityTwinWrapperSelector(state);
    const moduleIdentityWrapper = getModuleIdentityWrapperSelector(state);
    return {
        currentHostName: getActiveAzureResourceHostNameSelector(state),
        moduleIdentity: moduleIdentityWrapper && moduleIdentityWrapper.payload,
        moduleIdentitySyncStatus: moduleIdentityWrapper && moduleIdentityWrapper.synchronizationStatus,
        moduleIdentityTwin: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.payload,
        moduleIdentityTwinSyncStatus: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.synchronizationStatus,
        moduleListSyncStatus: getModuleIdentityListSyncStatusSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDetailDispatchProps => {
    return {
        deleteModuleIdentity: (params: DeleteModuleIdentityActionParameters) => dispatch(deleteModuleIdentityAction.started(params)),
        getModuleIdentity: (params: GetModuleIdentityActionParameters) => dispatch(getModuleIdentityAction.started(params)),
        getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => dispatch(getModuleIdentityTwinAction.started(params))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModuleIdentityDetailComponent);
