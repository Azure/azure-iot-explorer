/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import { DeviceSettings, DeviceSettingDispatchProps, DeviceSettingsProps } from './deviceSettings';
import { setComponentNameAction,
    patchDigitalTwinAction,
    PatchDigitalTwinActionParameters,
    getModelDefinitionAction,
    getDigitalTwinAction } from '../../actions';
import { getDeviceSettingTupleSelector } from './selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getModelDefinitionSyncStatusSelector, getDigitalTwinSynchronizationStatusSelector } from '../../selectors';

const mapStateToProps = (state: StateType): DeviceSettingsProps => {
    return {
        isLoading: getDigitalTwinSynchronizationStatusSelector(state) === SynchronizationStatus.working ||
            getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        ...getDeviceSettingTupleSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceSettingDispatchProps => {
    return {
        patchDigitalTwin: (parameters: PatchDigitalTwinActionParameters) => dispatch(patchDigitalTwinAction.started(parameters)),
        refresh: (deviceId: string, interfaceId: string) => {
            dispatch(getDigitalTwinAction.started(deviceId));
            dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
        },
        setComponentName: (id: string) => dispatch(setComponentNameAction(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSettings);
