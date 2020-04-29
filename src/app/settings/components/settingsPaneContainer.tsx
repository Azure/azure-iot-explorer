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

import { addNotificationAction } from '../../notifications/actions';
import { Notification } from '../../api/models/notification';
import { setConnectionStringsAction } from '../../connectionStrings/actions';
import { getActiveAzureResourceConnectionStringSelector } from '../../azureResource/selectors';

const mapStateToProps = (state: StateType): SettingsPaneProps => {
    return {
        isOpen: getSettingsVisibleSelector(state),
        repositoryLocationSettings: getRepositoryLocationSettingsSelector(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): SettingsPaneActions => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
        onSettingsSave: (payload: Settings) => {
            dispatch(setSettingsRepositoryLocationsAction(payload.repositoryLocationSettings));
        },
        onSettingsVisibleChanged: (visible: boolean) => {
            dispatch(setSettingsVisibilityAction(visible));
        }
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(SettingsPane);
