/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsComponent, { DeviceEventsDataProps, DeviceEventsActionProps } from './deviceEvents';
import { getActiveAzureResourceConnectionStringSelector } from '../../../../azureResource/selectors';
import { addNotificationAction } from '../../../../notifications/actions';
import { Notification } from '../../../../api/models/notification';

const mapStateToProps = (state: StateType): DeviceEventsDataProps => {
    return {
        connectionString: getActiveAzureResourceConnectionStringSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DeviceEventsActionProps => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceEventsComponent);
