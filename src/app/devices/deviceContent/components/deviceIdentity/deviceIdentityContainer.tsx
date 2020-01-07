/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { compose, Dispatch } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceIdentityInformation, { DeviceIdentityDataProps, DeviceIdentityDispatchProps } from './deviceIdentity';
import { getDeviceIdentityWrapperSelector } from '../../selectors';
import { DeviceIdentity } from '../../../../api/models/deviceIdentity';
import { updateDeviceIdentityAction } from '../../actions';
import { getActiveAzureResourceHostNameSelector } from '../../../../azureResource/selectors';

const mapStateToProps = (state: StateType): DeviceIdentityDataProps => {
    return {
        activeAzureResourceHostName: getActiveAzureResourceHostNameSelector(state),
        identityWrapper: getDeviceIdentityWrapperSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DeviceIdentityDispatchProps => {
    return {
        updateDeviceIdentity: (deviceIdentity: DeviceIdentity) => dispatch(updateDeviceIdentityAction.started(deviceIdentity)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceIdentityInformation);
