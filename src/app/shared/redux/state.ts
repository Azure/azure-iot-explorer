/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AzureResourceStateInterface } from '../../azureResource/state';
import { DeviceContentStateType } from '../../devices/deviceContent/state';
import { DeviceListStateInterface } from '../../devices/deviceList/state';
import { ConnectionStringsStateInterface } from '../../connectionStrings/state';
import { NotificationsStateInterface } from '../../notifications/state';
import { ApplicationStateType } from '../../settings/state';
import { ModuleStateType } from '../../devices/module/state';
import { IM } from '../types/types';

export interface StateInterface {
    applicationState: ApplicationStateType;
    azureResourceState: AzureResourceStateInterface;
    connectionStringsState: ConnectionStringsStateInterface;
    deviceContentState: DeviceContentStateType;
    deviceListState: DeviceListStateInterface;
    notificationsState: NotificationsStateInterface;
    moduleState: ModuleStateType;
}

export type StateType = IM<StateInterface>;
