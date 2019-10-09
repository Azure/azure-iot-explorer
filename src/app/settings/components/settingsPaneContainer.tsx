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
import { setSettingsVisibilityAction, setSettingsRepositoryLocationsAction, setApplicationTheme } from '../actions';
import { getSettingsVisibleSelector, getRepositoryLocationSettingsSelector, getApplicationThemeSelector } from '../selectors';
import { getConnectionStringSelector, getRememberConnectionStringValueSelector } from '../../login/selectors';
import { setConnectionStringAction } from '../../login/actions';
import { listDevicesAction } from '../../devices/deviceList/actions';
import DeviceQuery from '../../api/models/deviceQuery';
import { Theme } from '../../../themer';

const mapStateToProps = (state: StateType): SettingsPaneProps => {
    return {
        hubConnectionString: getConnectionStringSelector(state),
        isOpen: getSettingsVisibleSelector(state),
        rememberConnectionString: getRememberConnectionStringValueSelector(state),
        repositoryLocations: getRepositoryLocationSettingsSelector(state),
        theme: getApplicationThemeSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): SettingsPaneActions => {
    return {
        onSetTheme: (payload: Theme) => {
            dispatch(setApplicationTheme(payload));
        },
        onSettingsSave: (payload: Settings) => {
            dispatch(setConnectionStringAction({
                connectionString: payload.hubConnectionString,
                rememberConnectionString: payload.rememberConnectionString
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
