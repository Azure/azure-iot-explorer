/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import { DeviceProperties, DevicePropertiesDataProps, DevicePropertiesDispatchProps } from './deviceProperties';
import { getDevicePropertyTupleSelector } from './selectors';
import { setComponentNameAction, getModelDefinitionAction, getDigitalTwinAction } from '../../actions';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getModelDefinitionSyncStatusSelector, getDigitalTwinSynchronizationStatusSelector } from '../../selectors';

const mapStateToProps = (state: StateType): DevicePropertiesDataProps => {
    return {
        isLoading: getDigitalTwinSynchronizationStatusSelector(state) === SynchronizationStatus.working ||
            getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        twinAndSchema: getDevicePropertyTupleSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DevicePropertiesDispatchProps => {
    return {
        refresh: (deviceId: string, interfaceId: string) => {
            dispatch(getDigitalTwinAction.started(deviceId));
            dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
        },
        setComponentName: (id: string) => dispatch(setComponentNameAction(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceProperties);
