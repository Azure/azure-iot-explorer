/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationListEntry, getNotificationIcon, getIconColor } from './notificationListEntry';
import { NotificationType } from '../../api/models/notification';
import { ErrorCircleRegular, CheckmarkCircleRegular, WarningRegular, InfoRegular } from '@fluentui/react-icons';

const pathname = '/devices/add';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname })
}));

describe('notificationListEntry', () => {

    it('renders notification entry', () => {
        render(<NotificationListEntry
            notification={{
                    text: {
                        translationKey: 'test'
                    },
                    type: NotificationType.success
                }}
            showAnnouncement={true}
        />);
        expect(screen.getByText('test')).toBeDefined();
    });

    describe('getNotificationIcon', () => {
        it('returns ErrorCircleRegular given NotificationType.error', () => {
            expect(getNotificationIcon(NotificationType.error)).toEqual(ErrorCircleRegular);
        });

        it('returns InfoRegular given NotificationType.info', () => {
            expect(getNotificationIcon(NotificationType.info)).toEqual(InfoRegular);
        });

        it('returns CheckmarkCircleRegular given NotificationType.success', () => {
            expect(getNotificationIcon(NotificationType.success)).toEqual(CheckmarkCircleRegular);
        });

        it('returns WarningRegular given NotificationType.warning', () => {
            expect(getNotificationIcon(NotificationType.warning)).toEqual(WarningRegular);
        });
    });

    describe('getIconColor', () => {
        it('returns error given NotificationType.error', () => {
            expect(getIconColor(NotificationType.error)).toEqual('error');
        });

        it('returns info given NotificationType.info', () => {
            expect(getIconColor(NotificationType.info)).toEqual('info');
        });

        it('returns success given NotificationType.success', () => {
            expect(getIconColor(NotificationType.success)).toEqual('success');
        });

        it('returns warning given NotificationType.warning', () => {
            expect(getIconColor(NotificationType.warning)).toEqual('warning');
        });
    });
});