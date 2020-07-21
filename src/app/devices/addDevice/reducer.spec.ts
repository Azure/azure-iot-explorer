/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { addDeviceAction } from './actions';
import { addDeviceReducer } from './reducer';
import { addDeviceStateInitial } from './state';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

describe('AddDeviceReducer', () => {
    it(`handles ADD_DEVICE/ACTION_START action`, () => {
        const action = addDeviceAction.started(undefined);
        expect(addDeviceReducer(addDeviceStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.working);
    });

    it(`handles ADD_DEVICE/ACTION_DONE action`, () => {
        const action = addDeviceAction.done({ params: undefined, result: undefined });
        expect(addDeviceReducer(addDeviceStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.upserted);
    });

    it(`handles ADD_DEVICE/ACTION_FAIL action`, () => {
        const action = addDeviceAction.failed(undefined);
        expect(addDeviceReducer(addDeviceStateInitial(), action).synchronizationStatus).toEqual(SynchronizationStatus.failed);
    });
});
