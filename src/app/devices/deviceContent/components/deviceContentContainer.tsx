/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { RouteComponentProps } from 'react-router-dom';
import { DeviceContentComponent, DeviceContentDispatchProps, DeviceContentDataProps } from './deviceContent';
import { StateType } from '../../../shared/redux/state';
import { getDeviceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getIsDevicePnpSelector, getDigitalTwinInterfaceIdsSelector, getDigitalTwinInterfacePropertiesWrapperSelector, getDeviceIdentityWrapperSelector } from '../selectors';
import { setComponentNameAction, getDigitalTwinInterfacePropertiesAction, getDeviceIdentityAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType, ownProps: RouteComponentProps): DeviceContentDataProps => {
    const digitalTwinInterfacesWrapper = getDigitalTwinInterfacePropertiesWrapperSelector(state);
    return {
        deviceId: getDeviceIdFromQueryString(ownProps),
        identityWrapper: getDeviceIdentityWrapperSelector(state),
        interfaceIds: getDigitalTwinInterfaceIdsSelector(state),
        isLoading: digitalTwinInterfacesWrapper &&
            digitalTwinInterfacesWrapper.synchronizationStatus === SynchronizationStatus.working,
        isPnPDevice: getIsDevicePnpSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceContentDispatchProps => {
    return {
        getDeviceIdentity: (deviceId: string) => dispatch(getDeviceIdentityAction.started(deviceId)),
        getDigitalTwinInterfaceProperties: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        setComponentName: (interfaceId: string) => dispatch(setComponentNameAction(interfaceId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: false,
})(DeviceContentComponent);
