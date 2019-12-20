/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AnyAction } from 'typescript-fsa';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ConnectivityPane, { ConnectivityPaneDataProps, ConnectivityPaneDispatchProps } from './connectivityPane';
import { StateType } from '../../shared/redux/state';
import { getConnectionStringSelector, getConnectionStringListSelector } from '../selectors';
import { clearDevicesAction } from '../../devices/deviceList/actions';
import { clearModelDefinitionsAction } from '../../devices/deviceContent/actions';
import { setConnectionStringAction, SetConnectionStringActionParameter } from '../actions';
import { addNotificationAction } from '../../notifications/actions';
import { Notification } from '../../api/models/notification';

const mapStateToProps = (state: StateType): ConnectivityPaneDataProps => {
    return {
        connectionString: getConnectionStringSelector(state),
        connectionStringList: getConnectionStringListSelector(),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): ConnectivityPaneDispatchProps => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
        saveConnectionInfo: (connectionStringSetting: SetConnectionStringActionParameter) => {
            dispatch(setConnectionStringAction(connectionStringSetting));
            dispatch(clearDevicesAction());
            dispatch(clearModelDefinitionsAction());
        },
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ConnectivityPane);
