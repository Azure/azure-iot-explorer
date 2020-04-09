/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { fetchDigitalTwinInterfaceProperties, patchDigitalTwinInterfaceProperties } from '../../../api/services/digitalTwinService';
import { NotificationType } from '../../../api/models/notification';
import { FetchDigitalTwinInterfacePropertiesParameters, PatchDigitalTwinInterfacePropertiesParameters } from '../../../api/parameters/deviceParameters';
import { DigitalTwinInterfaces, InterfaceModel, Property } from './../../../api/models/digitalTwinModels';
import { patchDigitalTwinInterfacePropertiesAction } from './../actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import { getDigitalTwinInterfacePropertiesAction, PatchDigitalTwinInterfacePropertiesActionParameters } from '../actions';
import { addNotificationAction } from '../../../notifications/actions';
import { getComponentNameSelector } from '../selectors';

export function* getDigitalTwinInterfacePropertySaga(action: Action<string>) {
    try {
        const parameters: FetchDigitalTwinInterfacePropertiesParameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            digitalTwinId: action.payload,
        };

        const digitalTwinInterfaceProperties = yield call(fetchDigitalTwinInterfaceProperties, parameters);

        yield put(getDigitalTwinInterfacePropertiesAction.done({params: action.payload, result: digitalTwinInterfaceProperties}));
    } catch (error) {
        yield put(getDigitalTwinInterfacePropertiesAction.failed({params: action.payload, error}));
    }
}

export function* patchDigitalTwinInterfacePropertiesSaga(action: Action<PatchDigitalTwinInterfacePropertiesActionParameters>) {
    try {
        const parameters: PatchDigitalTwinInterfacePropertiesParameters = {
            connectionString: yield call(getActiveAzureResourceConnectionStringSaga),
            digitalTwinId: action.payload.digitalTwinId,
            payload: yield call(generatePatchDigitalTwinInterfacePropertiesPayload, action.payload),
        };

        const twin = yield call(patchDigitalTwinInterfaceProperties, parameters);

        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.patchDigitalTwinInterfacePropertiesOnSuccess,
                translationOptions: {
                    deviceId: action.payload.digitalTwinId
                },
            },
            type: NotificationType.success
          }));

        yield put(patchDigitalTwinInterfacePropertiesAction.done({params: action.payload, result: twin}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.patchDigitalTwinInterfacePropertiesOnError,
                translationOptions: {
                    deviceId: action.payload.digitalTwinId,
                    error,
                },
            },
            type: NotificationType.error
          }));

        yield put(patchDigitalTwinInterfacePropertiesAction.failed({params: action.payload, error}));
    }
}

// tslint:disable-next-line:no-any
export const generateInterfacePropertiesPayload = (componentName: string, propertyKey: string, patchData: any) => {
    const propertyValue: { [propertyName: string]: Property } = {};
    propertyValue[propertyKey] = {
        desired: {
            value: patchData
        }
    };
    const interfaceData: { [propertyName: string]: InterfaceModel } = {};
    interfaceData[componentName] = {
        properties: {}
    };
    interfaceData[componentName].properties = propertyValue;
    const result: DigitalTwinInterfaces = {
        interfaces: interfaceData
    };

    return result;
};

export function* generatePatchDigitalTwinInterfacePropertiesPayload(interfacePatchData: PatchDigitalTwinInterfacePropertiesActionParameters) {
    const componentName = yield select(getComponentNameSelector);
    return generateInterfacePropertiesPayload(componentName, interfacePatchData.propertyKey, interfacePatchData.interfacesPatchData);
}
