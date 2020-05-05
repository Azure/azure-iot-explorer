/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AnyAction } from 'typescript-fsa';
import { StateType } from '../../../../shared/redux/state';
import DeviceEventsPerInterfaceComponent, { DeviceEventsDataProps, DeviceEventsDispatchProps } from './deviceEventsPerInterface';
import { getDeviceTelemetrySelector } from './selectors';
import { getModelDefinitionSyncStatusSelector } from '../../selectors';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { setComponentNameAction, getModelDefinitionAction } from '../../actions';
import { getActiveAzureResourceConnectionStringSelector } from '../../../../azureResource/selectors';
import { getComponentNameFromQueryString } from '../../../../shared/utils/queryStringHelper';
import { addNotificationAction } from '../../../../notifications/actions';
import { Notification } from '../../../../api/models/notification';

const mapStateToProps = (state: StateType, ownProps: RouteComponentProps): DeviceEventsDataProps => {
    return {
        componentName: getComponentNameFromQueryString(ownProps),
        connectionString: getActiveAzureResourceConnectionStringSelector(state),
        isLoading: getModelDefinitionSyncStatusSelector(state) === SynchronizationStatus.working,
        telemetrySchema: getDeviceTelemetrySelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DeviceEventsDispatchProps => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
        refresh: (deviceId: string, interfaceId: string) => dispatch(getModelDefinitionAction.started({digitalTwinId: deviceId, interfaceId})),
        setComponentName: (id: string) => dispatch(setComponentNameAction(id))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(DeviceEventsPerInterfaceComponent);
