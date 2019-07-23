/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import AddDevice, { AddDeviceActionProps } from './addDevice';
import { DeviceIdentity } from '../../../../../api/models/deviceIdentity';
import { addDeviceAction, listDevicesAction } from '../../../actions';

const mapDispatchToProps = (dispatch: Dispatch): AddDeviceActionProps => {
    return {
        handleSave: (deviceIdentity: DeviceIdentity) => dispatch(addDeviceAction.started(deviceIdentity)),
        listDevices: () => dispatch(listDevicesAction.started(undefined))
    };
};

export default connect(undefined, mapDispatchToProps, undefined, {
    pure: false,
})(AddDevice);
