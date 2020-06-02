/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import { DeviceCommands, DeviceCommandDispatchProps, DeviceCommandsProps } from './deviceCommands';
import { getDeviceCommandPairs } from './selectors';
import { invokeDigitalTwinInterfaceCommandAction, setComponentNameAction, InvokeDigitalTwinInterfaceCommandActionParameters, getModelDefinitionAction } from '../../actions';
import { getModelDefinitionSyncStatusSelector } from '../../selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType): DeviceCommandsProps => {
    return {
        isLoading: getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        ...getDeviceCommandPairs(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceCommandDispatchProps => {
    return {
        invokeDigitalTwinInterfaceCommand:
            (parameters: InvokeDigitalTwinInterfaceCommandActionParameters) => dispatch(invokeDigitalTwinInterfaceCommandAction.started(parameters)),
        refresh: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        setComponentName: (id: string) => dispatch(setComponentNameAction(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceCommands);
