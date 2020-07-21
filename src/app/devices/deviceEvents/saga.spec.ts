/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { put, call } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { startEventsMonitoringSagaWorker, stopEventsMonitoringSagaWorker } from './saga';
import { startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import * as DevicesService from '../../api/services/devicesService';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { DEFAULT_CONSUMER_GROUP } from '../../constants/apiConstants';

describe('deviceMonitoringSaga', () => {
    let startEventsMonitoringSagaGenerator;
    let stopEventsMonitoringSagaGenerator;

    const mockMonitorEventsFn = jest.spyOn(DevicesService, 'monitorEvents').mockImplementationOnce(parameters => {
        return null;
    });
    const mockStopMonitorEventsFn = jest.spyOn(DevicesService, 'stopMonitoringEvents').mockImplementationOnce(() => {
        return null;
    });
    const deviceId = 'test_id';
    const params = {consumerGroup: DEFAULT_CONSUMER_GROUP, deviceId, startTime: new Date()};

    beforeEach(() => {
        startEventsMonitoringSagaGenerator = cloneableGenerator(startEventsMonitoringSagaWorker)(startEventsMonitoringAction.started(params));
        stopEventsMonitoringSagaGenerator = cloneableGenerator(stopEventsMonitoringSagaWorker)();
    });

    it('start device events monitoring', () => {
        // call for device id
        expect(startEventsMonitoringSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockMonitorEventsFn, params)
        });

        // add to store
        expect(startEventsMonitoringSagaGenerator.next([])).toEqual({
            done: false,
            value: put(startEventsMonitoringAction.done({
                params,
                result: []
            }))
        });

        // success
        const success = startEventsMonitoringSagaGenerator.clone();
        expect(success.next()).toEqual({
            done: true
        });

        // failure
        const failed = startEventsMonitoringSagaGenerator.clone();
        const error = { code: -1 };

        expect(failed.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.startEventMonitoringOnError,
                    translationOptions: {
                        error
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failed.next([])).toEqual({
            done: false,
            value: put(startEventsMonitoringAction.failed({
                error,
                params
            }))
        });

        expect(failed.next().done).toEqual(true);
    });

    it('stop device events monitoring', () => {
        // call for device id
        expect(stopEventsMonitoringSagaGenerator.next()).toEqual({
            done: false,
            value: call(mockStopMonitorEventsFn)
        });

        // add to store
        expect(stopEventsMonitoringSagaGenerator.next([])).toEqual({
            done: false,
            value: put(stopEventsMonitoringAction.done({}))
        });

        // success
        const success = stopEventsMonitoringSagaGenerator.clone();
        expect(success.next()).toEqual({
            done: true
        });

        // failure
        const failed = stopEventsMonitoringSagaGenerator.clone();
        const error = { code: -1 };

        expect(failed.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.stopEventMonitoringOnError,
                    translationOptions: {
                        error
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failed.next([])).toEqual({
            done: false,
            value: put(stopEventsMonitoringAction.failed({
                error
            }))
        });

        expect(failed.next().done).toEqual(true);
    });
});
