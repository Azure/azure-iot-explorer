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
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { setActiveAzureResourceByConnectionStringAction } from '../../azureResource/actions';
import { listDevicesAction } from '../../devices/deviceList/actions';
import DeviceQuery from '../../api/models/deviceQuery';
import { addNotificationAction } from '../../notifications/actions';
import { Notification } from '../../api/models/notification';
import { setConnectionStringsAction } from '../../connectionStrings/actions';

const mapStateToProps = (state: StateType): SettingsPaneProps => {
    return {
        connectionStringList: state.connectionStringsState.connectionStrings,
        hubConnectionString: state.azureResourceState.activeAzureResource ? state.azureResourceState.activeAzureResource.connectionString : '',
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
                hostName: getConnectionInfoFromConnectionString(payload.hubConnectionString).hostName
            }));
            dispatch(setConnectionStringsAction(payload.connectionStringList));
            dispatch(setSettingsRepositoryLocationsAction(payload.repositoryLocations));
        },
        onSettingsVisibleChanged: (visible: boolean) => {
            dispatch(setSettingsVisibilityAction(visible));
        },
        refreshDevices: (query?: DeviceQuery) => dispatch(listDevicesAction.started(query)),
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SettingsPane);
