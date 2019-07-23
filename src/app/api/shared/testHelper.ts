/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../../shared/redux/state';
import { notificationsStateInterfaceInitial } from '../../notifications/state';
import { deviceContentStateInitial } from '../../devices/deviceContent/state';
import { deviceListStateInitial  } from '../../devices/deviceList/state';
import { connectionStateInitial } from '../../login/state';
import { applicationStateInitial } from '../../settings/state';

export const getInitialState = (): StateInterface => {
    return {
        applicationState: applicationStateInitial(),
        connectionState: connectionStateInitial(),
        deviceContentState: deviceContentStateInitial(),
        deviceListState: deviceListStateInitial(),
        notificationsState: notificationsStateInterfaceInitial
    };
};
