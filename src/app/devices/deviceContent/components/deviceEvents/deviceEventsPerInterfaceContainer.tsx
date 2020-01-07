/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsPerInterfaceComponent, { DeviceEventsDataProps, DeviceEventsDispatchProps } from './deviceEventsPerInterface';
import { getDeviceTelemetrySelector } from './selectors';
import { getModelDefinitionSyncStatusSelector, getInterfaceNameSelector } from '../../selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { setInterfaceIdAction, getModelDefinitionAction } from '../../actions';
import { getActiveAzureResourceConnectionStringSelector } from '../../../../azureResource/selectors';

const mapStateToProps = (state: StateType): DeviceEventsDataProps => {
    return {
        connectionString: getActiveAzureResourceConnectionStringSelector(state),
        interfaceName: getInterfaceNameSelector(state),
        isLoading: getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        telemetrySchema: getDeviceTelemetrySelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceEventsDispatchProps => {
    return {
        refresh: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        setInterfaceId: (id: string) => dispatch(setInterfaceIdAction(id))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceEventsPerInterfaceComponent);
