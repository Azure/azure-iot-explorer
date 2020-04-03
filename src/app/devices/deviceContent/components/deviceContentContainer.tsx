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
import { getDigitalTwinModelId, getDeviceIdentityWrapperSelector, getDigitalTwinSynchronizationStatusSelector } from '../selectors';
import { setComponentNameAction, getDigitalTwinAction, getDeviceIdentityAction } from '../actions';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const mapStateToProps = (state: StateType, ownProps: RouteComponentProps): DeviceContentDataProps => {
    const digitalTwinSynchronizationStatus = getDigitalTwinSynchronizationStatusSelector(state);
    return {
        deviceId: getDeviceIdFromQueryString(ownProps),
        digitalTwinModelId: getDigitalTwinModelId(state),
        identityWrapper: getDeviceIdentityWrapperSelector(state),
        isLoading: digitalTwinSynchronizationStatus === SynchronizationStatus.working
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceContentDispatchProps => {
    return {
        getDeviceIdentity: (deviceId: string) => dispatch(getDeviceIdentityAction.started(deviceId)),
        getDigitalTwin: (deviceId: string) => dispatch(getDigitalTwinAction.started(deviceId)),
        setComponentName: (interfaceId: string) => dispatch(setComponentNameAction(interfaceId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps, undefined, {
    pure: false,
})(DeviceContentComponent);
