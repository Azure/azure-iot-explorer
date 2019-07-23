/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from 'typescript-fsa';
import { DeviceContentComponent, DeviceContentDispatchProps, DeviceContentDataProps } from './deviceContent';
import { StateType } from '../../../shared/redux/state';
import { getIsDevicePnpSelector, getDigitalTwinInterfaceIdsSelector, getDigitalTwinInterfacePropertiesWrapperSelector } from '../selectors';
import { setInterfaceIdAction, getDigitalTwinInterfacePropertiesAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType): DeviceContentDataProps => {
    const digitalTwinInterfacesWrapper = getDigitalTwinInterfacePropertiesWrapperSelector(state);
    return {
        interfaceIds: getDigitalTwinInterfaceIdsSelector(state),
        isLoading: digitalTwinInterfacesWrapper &&
            digitalTwinInterfacesWrapper.digitalTwinInterfacePropertiesSyncStatus === SynchronizationStatus.working,
        isPnPDevice: getIsDevicePnpSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceContentDispatchProps => {
    return {
        getDigitalTwinInterfaceProperties: (deviceId: string) => dispatch(getDigitalTwinInterfacePropertiesAction.started(deviceId)),
        setInterfaceId: (interfaceId: string) => dispatch(setInterfaceIdAction(interfaceId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: false,
})(DeviceContentComponent);
