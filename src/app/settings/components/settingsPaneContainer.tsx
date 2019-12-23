/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AnyAction } from 'typescript-fsa';
import { compose, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StateType } from '../../shared/redux/state';
import SettingsPane, { SettingsPaneActions, SettingsPaneProps, Settings } from './settingsPane';
import { setSettingsVisibilityAction, setSettingsRepositoryLocationsAction } from '../actions';
import { getSettingsVisibleSelector, getRepositoryLocationSettingsSelector } from '../selectors';
import { getConnectionStringSelector, getConnectionStringListSelector } from '../../login/selectors';
import { setConnectionStringAction } from '../../login/actions';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { setActiveAzureResourceByConnectionStringAction } from '../../azureResource/actions';
import { listDevicesAction } from '../../devices/deviceList/actions';
import DeviceQuery from '../../api/models/deviceQuery';
import { addNotificationAction } from '../../notifications/actions';
import { Notification } from '../../api/models/notification';

const mapStateToProps = (state: StateType): SettingsPaneProps => {
    return {
        connectionStringList: getConnectionStringListSelector(),
        hubConnectionString: getConnectionStringSelector(state),
        isOpen: getSettingsVisibleSelector(state),
        repositoryLocations: getRepositoryLocationSettingsSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): SettingsPaneActions => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
        onSettingsSave: (payload: Settings) => {
            dispatch(setActiveAzureResourceByConnectionStringAction({
                connectionString: payload.hubConnectionString,
                connectionStringList: payload.connectionStringList,
                hostName: getConnectionInfoFromConnectionString(payload.hubConnectionString).hostName
            }));
            dispatch(setSettingsRepositoryLocationsAction(payload.repositoryLocations));
        },
        onSettingsVisibleChanged: (visible: boolean) => {
            dispatch(setSettingsVisibilityAction(visible));
        },
        refreshDevices: (query?: DeviceQuery) => dispatch(listDevicesAction.started(query)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SettingsPane);
