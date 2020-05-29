/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import { ModuleIdentityComponent, ModuleIdentityDataProps, ModuleIdentityDispatchProps } from './moduleIdentity';
import { getModuleIdentitiesAction } from '../../actions';
import { getModuleIdentityListWrapperSelector } from '../../selectors';

const mapStateToProps = (state: StateType): ModuleIdentityDataProps => {
    const moduleIdentityListWrapper = getModuleIdentityListWrapperSelector(state);
    return {
        moduleIdentityList: moduleIdentityListWrapper && moduleIdentityListWrapper.payload || [],
        synchronizationStatus: moduleIdentityListWrapper && moduleIdentityListWrapper.synchronizationStatus
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDispatchProps => {
    return {
        getModuleIdentities: (deviceId: string) => dispatch(getModuleIdentitiesAction.started(deviceId)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModuleIdentityComponent);
