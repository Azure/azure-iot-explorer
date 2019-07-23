/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { combineReducers } from 'redux';
import applicationStateReducer from '../../settings/reducers';
import connectionStateReducer from '../../login/reducer';
import deviceListStateReducer from '../../devices/deviceList/reducer';
import deviceContentStateReducer from '../../devices/deviceContent/reducer';
import notificationsStateReducer from '../../notifications/reducer';

const reducer = combineReducers({
    applicationState: applicationStateReducer,
    connectionState: connectionStateReducer,
    deviceContentState: deviceContentStateReducer,
    deviceListState: deviceListStateReducer,
    notificationsState: notificationsStateReducer
});

export default reducer;
