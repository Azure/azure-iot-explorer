/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { StateInterface } from '../../shared/redux/state';
import { notificationsStateInterfaceInitial } from '../../notifications/state';
import { deviceContentStateInitial } from '../../devices/deviceContent/state';
import { deviceListStateInitial  } from '../../devices/deviceList/state';
import { applicationStateInitial } from '../../settings/state';
import { azureResourceStateInitial } from '../../azureResource/state';
import { connectionStringsStateInitial } from '../../connectionStrings/state';
import { moduleStateInitial } from './../../devices/module/state';
import { iotHubStateInitial } from '../../../app/iotHub/state';

export const getInitialState = (): StateInterface => {
    return {
        applicationState: applicationStateInitial(),
        azureResourceState: azureResourceStateInitial(),
        connectionStringsState: connectionStringsStateInitial(),
        deviceContentState: deviceContentStateInitial(),
        deviceListState: deviceListStateInitial(),
        iotHubState: iotHubStateInitial(),
        moduleState: moduleStateInitial(),
        notificationsState: notificationsStateInterfaceInitial
    };
};
