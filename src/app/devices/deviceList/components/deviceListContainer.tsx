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
import { getDeviceSummaryListWrapper, deviceSummaryListWrapperNoPNPSelector } from '../selectors';
import DeviceQuery from '../../../api/models/deviceQuery';

const mapStateToProps = (state: StateType) => {
    const deviceSummaryListWrapper = getDeviceSummaryListWrapper(state);
    return {
        connectionString: getConnectionStringSelector(state),
        deviceListSyncStatus: deviceSummaryListWrapper && deviceSummaryListWrapper.get('deviceListSynchronizationStatus'),
        devices: deviceSummaryListWrapperNoPNPSelector(state)
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
