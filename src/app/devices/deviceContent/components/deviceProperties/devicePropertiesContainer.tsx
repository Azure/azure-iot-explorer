/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import DeviceProperties, { DevicePropertiesDataProps, DevicePropertiesDispatchProps } from './deviceProperties';
import { getDevicePropertyTupleSelector } from './selectors';
import { setInterfaceIdAction, getDigitalTwinInterfacePropertiesAction, getModelDefinitionAction } from '../../actions';
import { getDeviceTwinStateSelector } from '../deviceTwin/selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getModelDefinitionSyncStatusSelector } from '../../selectors';

const mapStateToProps = (state: StateType): DevicePropertiesDataProps => {
    return {
        isLoading: getDeviceTwinStateSelector(state) === SynchronizationStatus.working ||
            getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        twinAndSchema: getDevicePropertyTupleSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DevicePropertiesDispatchProps => {
    return {
        refresh: (deviceId: string, interfaceId: string) => {
            dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId));
            dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId}));
        },
        setInterfaceId: (id: string) => dispatch(setInterfaceIdAction(id))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceProperties);
