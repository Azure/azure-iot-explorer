/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDigitalTwin, patchDigitalTwinAndGetResponseCode } from '../../../../api/services/digitalTwinService';
import { PatchDigitalTwinParameters } from '../../../../api/parameters/deviceParameters';
import { raiseNotificationToast } from '../../../../notifications/components/notificationToast';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { NotificationType } from '../../../../api/models/notification';
import { DataPlaneStatusCode } from '../../../../constants/apiConstants';
import { PatchDigitalTwinActionParameters, patchDigitalTwinAction } from '../actions';

export function* patchDigitalTwinSaga(action: Action<PatchDigitalTwinActionParameters>) {
    try {
        const parameters: PatchDigitalTwinParameters = {
            ...action.payload,
        };

        const response = yield call(patchDigitalTwinAndGetResponseCode, parameters);
        const digitalTwin = yield call(fetchDigitalTwin, { digitalTwinId: parameters.digitalTwinId});

        if (response === DataPlaneStatusCode.Accepted || response === DataPlaneStatusCode.SuccessLowerBound) {
            yield call(raiseNotificationToast, {
                text: {
                    translationKey: response === DataPlaneStatusCode.Accepted ?
                        ResourceKeys.notifications.patchDigitalTwinOnAccept : ResourceKeys.notifications.patchDigitalTwinOnSuccess,
                    translationOptions: {
                        deviceId: action.payload.digitalTwinId
                    },
                },
                type: NotificationType.success
            });
            yield put(patchDigitalTwinAction.done({params: action.payload, result: digitalTwin}));
        }
        else {
            throw new Error(response);
        }
    } catch (error) {
        yield call(raiseNotificationToast, {
            text: {
                translationKey: ResourceKeys.notifications.patchDigitalTwinOnError,
                translationOptions: {
                    deviceId: action.payload.digitalTwinId,
                    error,
                },
            },
            type: NotificationType.error
        });

        yield put(patchDigitalTwinAction.failed({params: action.payload, error}));
    }
}
