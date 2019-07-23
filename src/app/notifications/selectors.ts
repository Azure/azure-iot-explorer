/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface  } from '../shared/redux/state';

export const getNotificationsSelector = (state: StateInterface) => {
    if (!state.notificationsState) {
        return [];
    }
    return state.notificationsState.notifications;
};

export const hasNewNotificationsSelector = (state: StateInterface) => {
    return state && state.notificationsState.hasNew;
};
