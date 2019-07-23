import { call, put, select } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { FetchDigitalTwinInterfacePropertiesParameters } from '../../../api/parameters/deviceParameters';
import { getConnectionStringSelector } from '../../../login/selectors';
import { fetchDigitalTwinInterfaceProperties } from '../../../api/services/devicesService';
import { fetchInterfacesAction } from '../actions';
import { addNotificationAction } from '../../../notifications/actions';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { NotificationType } from '../../../api/models/notification';

export function* fetchDigitalTwinInterfacePropertiesSaga(action: Action<string>) {
    try {
        const parameters: FetchDigitalTwinInterfacePropertiesParameters = {
            connectionString: yield select(getConnectionStringSelector),
            digitalTwinId: action.payload
        };

        const interfaces = yield call(fetchDigitalTwinInterfaceProperties, parameters);

        yield put(fetchInterfacesAction.done({params: action.payload, result: interfaces}));
    } catch (error) {
        yield put(addNotificationAction.started({
            text: {
                translationKey: ResourceKeys.notifications.getDigitalTwinInterfacePropertiesOnError,
                translationOptions: {
                    deviceId: action.payload,
                    error
                }
            },
            type: NotificationType.error
        }));

        yield put(fetchInterfacesAction.failed({params: action.payload, error}));
    }
}
