/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import DeviceListComponent, { DeviceListDispatchProps } from './deviceList';
import { StateType } from '../../../shared/redux/state';
import { getConnectionStringSelector } from '../../../login/selectors';
import { listDevicesAction, deleteDevicesAction } from '../actions';
import { getDeviceSummaryListStatus, deviceSummaryListWrapperNoPNPSelector } from '../selectors';
import DeviceQuery from '../../../api/models/deviceQuery';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType) => {
    return {
        connectionString: getConnectionStringSelector(state),
        devices: deviceSummaryListWrapperNoPNPSelector(state),
        isFetching: getDeviceSummaryListStatus(state) === SynchronizationStatus.working
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DeviceListDispatchProps => {
    return {
        deleteDevices: (deviceIds: string[]) => dispatch(deleteDevicesAction.started(deviceIds)),
        listDevices: (query?: DeviceQuery) => dispatch(listDevicesAction.started(query)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: true,
})(DeviceListComponent);
