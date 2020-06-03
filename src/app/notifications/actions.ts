/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../constants/actionPrefixes';
import * as actionTypes from '../constants/actionTypes';
import { Notification } from '../api/models/notification';

const actionCreator = actionCreatorFactory(actionPrefixes.NOTIFICATIONS);

export const clearNotificationsAction = actionCreator(actionTypes.CLEAR);
export const addNotificationAction = actionCreator<Notification>(actionTypes.ADD);
export const markAllNotificationsAsReadAction = actionCreator(actionTypes.READ);
