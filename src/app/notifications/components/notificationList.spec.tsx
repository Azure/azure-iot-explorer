/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { NotificationList } from './notificationList';

describe('notificationList', () => {
    it('matches snapshot', () => {
        expect(shallow(
            <NotificationList
                hasNew={true}
                notifications={[]}
                dismissNotifications={jest.fn()}
                markAllNotificationsAsRead={jest.fn()}
            />)).toMatchSnapshot();
    });
});
