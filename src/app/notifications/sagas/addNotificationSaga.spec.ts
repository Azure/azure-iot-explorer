/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, getContext, put } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { addNotificationSaga } from './addNotificationSaga';
import { addNotificationAction } from '../actions';
import { Notification, NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../components/notificationToast';

describe('addNotificationSaga', () => {

    describe('notification with date', () => {
        const notification: Notification = {
            issued: Date(),
            text: {
                translationKey: 'key'
            },
            title: {
                translationKey: 'key'
            },
            type: NotificationType.error
        };
        const addNotificationSagaGenerator = cloneableGenerator(addNotificationSaga)(addNotificationAction.started(notification));

        it('yields put effect to addNotificationAction.done', () => {
            expect(addNotificationSagaGenerator.next()).toEqual({
                done: false,
                value: put(addNotificationAction.done({params: notification, result: notification}))
            });
        });

        it('finishes', () => {
            expect(addNotificationSagaGenerator.next()).toEqual({
                done: true
            });
        });
    });

    describe('notification without date', () => {
        const notification: Notification = {
            text: {
                translationKey: 'key'
            },
            title: {
                translationKey: 'key'
            },
            type: NotificationType.error
        };
        const addNotificationSagaGenerator = cloneableGenerator(addNotificationSaga)(addNotificationAction.started(notification));

        it('yields call effect to get date', () => {
            expect(addNotificationSagaGenerator.next()).toEqual({
                done: false,
                value: call(Date)
            });
        });

        it('yields put effect to addNotificationAction.done', () => {
            expect(addNotificationSagaGenerator.next('date')).toEqual({
                done: false,
                value: put(addNotificationAction.done({params: notification, result: notification}))
            });
        });

        it('finishes', () => {
            expect(addNotificationSagaGenerator.next()).toEqual({
                done: true
            });
        });
    });
});
