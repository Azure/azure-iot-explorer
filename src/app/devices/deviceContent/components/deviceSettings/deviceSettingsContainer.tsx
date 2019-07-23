/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import DeviceSettings, { DeviceSettingDispatchProps, DeviceSettingsProps } from './deviceSettings';
import { setInterfaceIdAction, patchDigitalTwinInterfacePropertiesAction, PatchDigitalTwinInterfacePropertiesActionParameters, getDigitalTwinInterfacePropertiesAction, getModelDefinitionAction } from '../../actions';
import { getDeviceSettingTupleSelector } from './selectors';
import { getDeviceTwinStateSelector } from '../deviceTwin/selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getModelDefinitionSyncStatusSelector } from '../../selectors';

const mapStateToProps = (state: StateType): DeviceSettingsProps => {
    return {
        isLoading: getDeviceTwinStateSelector(state) === SynchronizationStatus.working ||
            getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        ...getDeviceSettingTupleSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceSettingDispatchProps => {
    return {
        patchDigitalTwinInterfaceProperties:
            (parameters: PatchDigitalTwinInterfacePropertiesActionParameters) => dispatch(patchDigitalTwinInterfacePropertiesAction.started(parameters)),
        refresh: (deviceId: string, interfaceId: string) => {
            dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId));
            dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
        },
        setInterfaceId: (id: string) => dispatch(setInterfaceIdAction(id))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceSettings);
