/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { put, call } from 'redux-saga/effects';
// tslint:disable-next-line: no-implicit-dependencies
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { setDecoderInfoSagaWorker, startEventsMonitoringSagaWorker, stopEventsMonitoringSagaWorker } from './saga';
import { setDecoderInfoAction, startEventsMonitoringAction, stopEventsMonitoringAction } from './actions';
import * as DevicesService from '../../api/services/devicesService';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { NotificationType } from '../../api/models/notification';
import { raiseNotificationToast } from '../../notifications/components/notificationToast';
import { DEFAULT_CONSUMER_GROUP } from '../../constants/apiConstants';
import { setDecoderInfo } from './utils';
import { Type } from 'protobufjs';

describe('deviceMonitoringSaga', () => {
    let startEventsMonitoringSagaGenerator;

    const mockMonitorEventsFn = jest.spyOn(DevicesService, 'monitorEvents').mockImplementationOnce(() => {
        return null;
    });
    const deviceId = 'test_id';
    const params = {consumerGroup: DEFAULT_CONSUMER_GROUP, deviceId, moduleId: ''};

    beforeEach(() => {
        startEventsMonitoringSagaGenerator = cloneableGenerator(startEventsMonitoringSagaWorker)(startEventsMonitoringAction.started(params));
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
                params
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
});

describe('setDecoderInfoSaga', () => {
    let setDecoderInfoSagaGenerator;
    const params = {decoderFile: new File([], ''), decoderPrototype: 'decoderPrototype', decodeType: 'Protobuf'};

    beforeEach(() => {
        setDecoderInfoSagaGenerator = cloneableGenerator(setDecoderInfoSagaWorker)(setDecoderInfoAction.started(params));
    });

    it('yield to set Decoder information', () => {
        // call for device id
        expect(setDecoderInfoSagaGenerator.next()).toEqual({
            done: false,
            value: call(setDecoderInfo, params)
        });

        expect(setDecoderInfoSagaGenerator.next(new Type(''))).toEqual({
            done: false,
            value: put(setDecoderInfoAction.done({
                params,
                result: {decodeType: 'Protobuf', decoderProtoFile: new File([], ''), decoderPrototype: new Type('')}
            }))
        });

        // success
        const success = setDecoderInfoSagaGenerator.clone();
        expect(success.next()).toEqual({
            done: true
        });

        // failure
        const failed = setDecoderInfoSagaGenerator.clone();
        const error = { code: -1, message: 'this is a error' };

        expect(failed.throw(error)).toEqual({
            done: false,
            value: call(raiseNotificationToast, {
                text: {
                    translationKey: ResourceKeys.notifications.updateCustomDecoderOnError,
                    translationOptions: {
                        error: error.message
                    },
                },
                type: NotificationType.error
            })
        });

        expect(failed.next()).toEqual({
            done: false,
            value: put(setDecoderInfoAction.failed({
                error,
                params
            }))
        });

        expect(failed.next().done).toEqual(true);
    });
});
