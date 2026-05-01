/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { NotificationList } from './notificationList';
import * as NotificationsContext from '../context/notificationsStateContext';
import { NotificationType } from '../../api/models/notification';
import { getInitialNotificationsState } from '../state';
import { getInitialNotificationsActions } from '../interface';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: 'url', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

}));

describe('notificationList', () => {
    it('renders when there are no notifications', () => {
        jest.spyOn(NotificationsContext, 'useNotificationsContext').mockReturnValueOnce([getInitialNotificationsState(), getInitialNotificationsActions()]);
        const { container } = render(<NotificationList/>);
        expect(container).toBeDefined();
    });

    it('renders when there are notifications', () => {
        const initialState = {
            ...getInitialNotificationsState(),
            hasNew: true,
            notifications: [{
                text: {
                    translationKey: 'test'
                },
                type: NotificationType.success
            }]
        };
        jest.spyOn(NotificationsContext, 'useNotificationsContext').mockReturnValueOnce([initialState, getInitialNotificationsActions()]);
        const { container } = render(<NotificationList/>);
        expect(container).toBeDefined();
    });
});