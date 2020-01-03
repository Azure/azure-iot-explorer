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
import { addNotificationAction } from '../../notifications/actions';
import { setActiveAzureResourceByConnectionStringAction, SetActiveAzureResourceByConnectionStringActionParameters } from '../../azureResource/actions';
import { Notification } from '../../api/models/notification';
import { setConnectionStringsAction } from '../../connectionStrings/actions';

const mapStateToProps = (state: StateType): ConnectivityPaneDataProps => {
    return {
        connectionString: state.azureResourceState.activeAzureResource ? state.azureResourceState.activeAzureResource.connectionString : '',
        connectionStringList: state.connectionStringsState.connectionStrings
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): ConnectivityPaneDispatchProps => {
    return {
        addNotification: (notification: Notification) => dispatch(addNotificationAction.started(notification)),
        setActiveAzureResource: (parameters: SetActiveAzureResourceByConnectionStringActionParameters) => dispatch(setActiveAzureResourceByConnectionStringAction(parameters)),
        setConnectionStrings: (connectionStrings: string[]) => dispatch(setConnectionStringsAction(connectionStrings))
    };
};

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(ConnectivityPane);
