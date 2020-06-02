/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import { ModuleIdentityDetailComponent, ModuleIdentityTwinDataProps, ModuleIdentityTwinDispatchProps } from './moduleIdentityTwin';
import { getModuleIdentityTwinAction, GetModuleIdentityTwinActionParameters } from '../../actions';
import { getModuleIdentityTwinWrapperSelector } from '../../selectors';

const mapStateToProps = (state: StateType): ModuleIdentityTwinDataProps => {
    const moduleIdentityTwinWrapper = getModuleIdentityTwinWrapperSelector(state);
    return {
        moduleIdentityTwin: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.payload,
        moduleIdentityTwinSyncStatus: moduleIdentityTwinWrapper && moduleIdentityTwinWrapper.synchronizationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityTwinDispatchProps => {
    return {
        getModuleIdentityTwin: (params: GetModuleIdentityTwinActionParameters) => dispatch(getModuleIdentityTwinAction.started(params))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModuleIdentityDetailComponent);
