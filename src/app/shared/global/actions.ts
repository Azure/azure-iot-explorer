/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { MODEL_REPOSITORY, NOTIFICATIONS } from '../../constants/actionPrefixes';
import { SET, CLEAR, READ, ADD } from '../../constants/actionTypes';
import { RepositoryLocationSettings } from './state';
import { Notification } from '../../api/models/notification';

const modelRepositoryFactory = actionCreatorFactory(MODEL_REPOSITORY);
export const setRepositoryLocationsAction = modelRepositoryFactory<RepositoryLocationSettings[]>(SET);

const notificationActionCreator = actionCreatorFactory(NOTIFICATIONS);

export const clearNotificationsAction = notificationActionCreator(CLEAR);
export const addNotificationAction = notificationActionCreator<Notification>(ADD);
export const markAllNotificationsAsReadAction = notificationActionCreator(READ);
