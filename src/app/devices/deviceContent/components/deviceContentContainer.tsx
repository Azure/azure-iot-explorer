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
import { getDeviceIdFromQueryString, getInterfaceIdFromQueryString } from '../../../shared/utils/queryStringHelper';
import { getIsDevicePnpSelector, getDigitalTwinInterfaceIdsSelector, getDigitalTwinInterfacePropertiesWrapperSelector, getDeviceIdentityWrapperSelector } from '../selectors';
import { setInterfaceIdAction, getDigitalTwinInterfacePropertiesAction, getDeviceIdentityAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType, ownProps: RouteComponentProps): DeviceContentDataProps => {
    const digitalTwinInterfacesWrapper = getDigitalTwinInterfacePropertiesWrapperSelector(state);
    return {
        deviceId: getDeviceIdFromQueryString(ownProps),
        identityWrapper: getDeviceIdentityWrapperSelector(state),
        interfaceId: getInterfaceIdFromQueryString(ownProps),
        interfaceIds: getDigitalTwinInterfaceIdsSelector(state),
        isLoading: digitalTwinInterfacesWrapper &&
            digitalTwinInterfacesWrapper.digitalTwinInterfacePropertiesSyncStatus === SynchronizationStatus.working,
        isPnPDevice: getIsDevicePnpSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceContentDispatchProps => {
    return {
        getDeviceIdentity: (deviceId: string) => dispatch(getDeviceIdentityAction.started(deviceId)),
        getDigitalTwinInterfaceProperties: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        setInterfaceId: (interfaceId: string) => dispatch(setInterfaceIdAction(interfaceId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: false,
})(DeviceContentComponent);
