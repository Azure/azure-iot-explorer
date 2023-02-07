/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { getInitialNotificationsActions, NotificationsInterface } from '../interface';
import { getInitialNotificationsState, NotificationsStateInterface } from '../state';

const NotificationsContext = React.createContext<[NotificationsStateInterface, NotificationsInterface]>(
    [getInitialNotificationsState(), getInitialNotificationsActions()]
);
export const NotificationsContextProvider = NotificationsContext.Provider;
export const useNotificationsContext = () => React.useContext(NotificationsContext);
