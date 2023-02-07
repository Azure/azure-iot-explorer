/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { NOTIFICATIONS } from '../constants/actionPrefixes';
import { CLEAR, READ, ADD } from '../constants/actionTypes';
import { Notification } from '../api/models/notification';

const notificationActionCreator = actionCreatorFactory(NOTIFICATIONS);
export const clearNotificationsAction = notificationActionCreator(CLEAR);
export const addNotificationAction = notificationActionCreator<Notification>(ADD);
export const markAllNotificationsAsReadAction = notificationActionCreator(READ);
