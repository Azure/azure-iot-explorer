/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import { getModelDefinitionSyncStatusSelector, getModelDefinitionWithSourceSelector } from '../../selectors';
import { DeviceInterfaces, DeviceInterfaceProps, DeviceInterfaceDispatchProps } from './deviceInterfaces';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { setComponentNameAction, getModelDefinitionAction } from '../../actions';

const mapStateToProps = (state: StateType): DeviceInterfaceProps => {
    const modelSyncStatus = getModelDefinitionSyncStatusSelector(state);
    return {
        isLoading: getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working ||
            modelSyncStatus === SynchronizationStatus.working,
        modelDefinitionWithSource: getModelDefinitionWithSourceSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceInterfaceDispatchProps => {
    return {
        refresh: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        setComponentName: (id: string) => dispatch(setComponentNameAction(id)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceInterfaces);
