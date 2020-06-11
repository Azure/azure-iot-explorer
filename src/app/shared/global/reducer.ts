/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { format } from 'date-fns';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { setRepositoryLocationsAction, clearNotificationsAction, markAllNotificationsAsReadAction, addNotificationAction } from './actions';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { globalStateInitial, GlobalStateType, RepositoryLocationSettings } from './state';
import { Notification } from '../../api/models/notification';

export const globalReducer = reducerWithInitialState<GlobalStateType>(globalStateInitial())
    .case(setRepositoryLocationsAction, (state: GlobalStateType, payload: RepositoryLocationSettings[]) => {
        const locationTypes = getRepositoryLocationTypes(payload);
        const localFolderPath = getLocalFolderPath(payload);

        const updatedState = {...state.modelRepositoryState};
        updatedState.localFolderSettings = { path: localFolderPath };
        updatedState.repositoryLocations = locationTypes;

        return state.merge({ modelRepositoryState: updatedState });
    })
    .case(clearNotificationsAction, (state: GlobalStateType) => {
        return state.merge({
            notificationsState: {
                hasNew: false,
                notifications: []
            }
        });
    })
    .case(markAllNotificationsAsReadAction, (state: GlobalStateType) => {
        return state.setIn(['notificationsState', 'hasNew'], false);
    })
    .case(addNotificationAction, (state: GlobalStateType, payload: Notification) => {
        const existingNotifications: Notification[] = state.notificationsState.notifications;
        let notifications: Notification[] = [];
        let existingId: boolean = false;

        if (!payload.issued) {
            payload.issued = format(new Date(), 'h:mm:ss a');
        }

        if (payload.id) {
            notifications = existingNotifications.map(notification => {
                if (notification.id && notification.id === payload.id) {
                    existingId = true;
                    return payload;
                }

                return notification;
            });
        }

        if (!existingId) {
            notifications = [payload, ...existingNotifications];
        }

        return state.merge({
            notificationsState: {
                hasNew: true,
                notifications
            }
        });
    });

export const getRepositoryLocationTypes = (locations: RepositoryLocationSettings[]): REPOSITORY_LOCATION_TYPE[] => {
    const locationTypes = locations.map(location => location.repositoryLocationType);
    return locationTypes;
};

export const getLocalFolderPath = (locations: RepositoryLocationSettings[]): string => {
    let localFolderSetting = '';
    locations.forEach(s => {
        if (s.repositoryLocationType === REPOSITORY_LOCATION_TYPE.Local) {
            localFolderSetting = s.value || '';
        }
    });

    return localFolderSetting;
};
