/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { NotificationList } from './notificationList';
import * as NotificationsContext from '../context/notificationsStateContext';
import { NotificationType } from '../../api/models/notification';
import { getInitialNotificationsState } from '../state';
import { getInitialNotificationsActions } from '../interface';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: 'url', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

}));

describe('notificationList', () => {
    it('matches snapshot where there are no notifications', () => {
        jest.spyOn(NotificationsContext, 'useNotificationsContext').mockReturnValueOnce([getInitialNotificationsState(), getInitialNotificationsActions()]);
        expect(shallow(<NotificationList/>)).toMatchSnapshot();
    });

    it('matches snapshot where there is no notifications', () => {
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
        expect(shallow(<NotificationList/>)).toMatchSnapshot();
    });
});
