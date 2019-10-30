/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import ModuleIdentity, { ModuleIdentityDataProps, ModuleIdentityDispatchProps } from './moduleIdentity';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType): ModuleIdentityDataProps => {
    return {
        // tslint:disable-next-line:no-any
        moduleIdentityListWrapper: {moduleIdentities: [], synchronizationStatus: SynchronizationStatus.working} as any
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ModuleIdentityDispatchProps => {
    return {
        // tslint:disable-next-line:no-empty
        getModuleIdentities: (deviceId: string) => { } // dispatch(getTwinAction.started(deviceId)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ModuleIdentity);
