/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { NotificationList } from './notificationList';
import * as GlobalStateContext from '../../shared/contexts/globalStateContext';
import { globalStateInitial } from '../../shared/global/state';
import { NotificationType } from '../../api/models/notification';

describe('notificationList', () => {
    it('matches snapshot where there is no notifications', () => {
        jest.spyOn(GlobalStateContext, 'useGlobalStateContext').mockReturnValueOnce({globalState: globalStateInitial(), dispatch: jest.fn()});
        expect(shallow(<NotificationList/>)).toMatchSnapshot();
    });

    it('matches snapshot where there is no notifications', () => {
        const initialState = globalStateInitial().merge({
            notificationsState: {
                hasNew: true,
                notifications: [{
                    text: {
                        translationKey: 'test'
                    },
                    type: NotificationType.success
                }]
            }
        });
        jest.spyOn(GlobalStateContext, 'useGlobalStateContext').mockReturnValueOnce({globalState: initialState, dispatch: jest.fn()});
        expect(shallow(<NotificationList/>)).toMatchSnapshot();
    });
});
