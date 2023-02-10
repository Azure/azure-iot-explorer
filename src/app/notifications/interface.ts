/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Notification } from '../api/models/notification';

export interface NotificationsInterface {
    clearNotifications(): void;
    addNotification(item: Notification): void;
    markAllAsRead(): void;
}

export const getInitialNotificationsActions = (): NotificationsInterface => ({
    clearNotifications: () => undefined,
    addNotification: () => undefined,
    markAllAsRead: () => undefined
});
