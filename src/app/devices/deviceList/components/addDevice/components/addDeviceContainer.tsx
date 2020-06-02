/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AddDevice, AddDeviceActionProps, AddDeviceDataProps } from './addDevice';
import { DeviceIdentity } from '../../../../../api/models/deviceIdentity';
import { addDeviceAction } from '../../../actions';
import { StateType } from '../../../../../shared/redux/state';
import { getDeviceSummaryListStatus } from '../../../selectors';

const mapDispatchToProps = (dispatch: Dispatch): AddDeviceActionProps => {
    return {
        handleSave: (deviceIdentity: DeviceIdentity) => dispatch(addDeviceAction.started(deviceIdentity)),
    };
};

const mapStateToProps = (state: StateType): AddDeviceDataProps => {
    return {
        deviceListSyncStatus: getDeviceSummaryListStatus(state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: false,
})(AddDevice);
