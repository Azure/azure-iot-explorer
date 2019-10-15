/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import DeviceCommands, { DeviceCommandDispatchProps, DeviceCommandsProps } from './deviceCommands';
import { getDeviceCommandPairs } from './selectors';
import { invokeDigitalTwinInterfaceCommandAction, setInterfaceIdAction, InvokeDigitalTwinInterfaceCommandActionParameters, getModelDefinitionAction } from '../../actions';
import { getModelDefinitionSyncStatusSelector, getInterfaceNameSelector } from '../../selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType): DeviceCommandsProps => {
    return {
        isLoading: getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        ...getDeviceCommandPairs(state),
        interfaceName: getInterfaceNameSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceCommandDispatchProps => {
    return {
        invokeDigitalTwinInterfaceCommand:
            (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => dispatch(invokeDigitalTwinInterfaceCommandAction.started(parameters)),
        refresh: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        setInterfaceId: (id: string) => dispatch(setInterfaceIdAction(id))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceCommands);
