/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import { ModuleIdentityDetailComponent, ModuleIdentityDetailDataProps, ModuleIdentityDetailDispatchProps } from './moduleIdentityDetail';
import {
    getModuleIdentityAction,
    GetModuleIdentityActionParameters,
    deleteModuleIdentityAction,
    DeleteModuleIdentityActionParameters
} from '../../actions';
import { getModuleIdentityWrapperSelector, getModuleIdentityListSyncStatusSelector } from '../../selectors';
import { getActiveAzureResourceHostNameSelector } from '../../../../azureResource/selectors';

const mapStateToProps = (state: StateType): ModuleIdentityDetailDataProps => {
    const moduleIdentityWrapper = getModuleIdentityWrapperSelector(state);
    return {
        currentHostName: getActiveAzureResourceHostNameSelector(state),
        moduleIdentity: moduleIdentityWrapper && moduleIdentityWrapper.payload,
        moduleIdentitySyncStatus: moduleIdentityWrapper && moduleIdentityWrapper.synchronizationStatus,
        moduleListSyncStatus: getModuleIdentityListSyncStatusSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDetailDispatchProps => {
    return {
        deleteModuleIdentity: (params: DeleteModuleIdentityActionParameters) => dispatch(deleteModuleIdentityAction.started(params)),
        getModuleIdentity: (params: GetModuleIdentityActionParameters) => dispatch(getModuleIdentityAction.started(params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleIdentityDetailComponent);
