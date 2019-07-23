/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { shallow } from 'enzyme';
import { NotificationListEntry, getIconName, getIconColor } from './notificationListEntry';
import { Notification, NotificationType } from '../../api/models/notification';

describe('getIconName', () => {
    it('returns ErrorBadge given NotificationType.error', () => {
        expect(getIconName(NotificationType.error)).toEqual('ErrorBadge');
    });

    it('returns Info given NotificationType.info', () => {
        expect(getIconName(NotificationType.info)).toEqual('Info');
    });

    it('returns Completed given NotificationType.success', () => {
        expect(getIconName(NotificationType.success)).toEqual('Completed');
    });

    it('returns Warning given NotificationType.warning', () => {
        expect(getIconName(NotificationType.warning)).toEqual('Warning');
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
