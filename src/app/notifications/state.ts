/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Notification } from '../api/models/notification';

export interface NotificationsStateInterface {
    hasNew: boolean;
    notifications: Notification[];
}

export const notificationsStateInterfaceInitial: NotificationsStateInterface = {
    hasNew: false,
    notifications: []
};
