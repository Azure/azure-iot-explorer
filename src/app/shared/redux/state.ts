/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceStateInterface } from '../../azureResource/state';
import { DeviceContentStateType } from '../../devices/deviceContent/state';
import { DeviceListStateInterface } from '../../devices/deviceList/state';
import { ConnectionStateType } from '../../login/state';
import { ConnectionStringsStateInterface } from '../../connectionStrings/state';
import { NotificationsStateInterface } from '../../notifications/state';
import { ApplicationStateType } from '../../settings/state';
import { IM } from '../types/types';

export interface StateInterface {
    applicationState: ApplicationStateType;
    azureResourceState: AzureResourceStateInterface;
    connectionState: ConnectionStateType;
    connectionStringsState: ConnectionStringsStateInterface;
    deviceContentState: DeviceContentStateType;
    deviceListState: DeviceListStateInterface;
    notificationsState: NotificationsStateInterface;
}

export type StateType = IM<StateInterface>;
