/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

import { Action } from 'typescript-fsa';
import { put } from 'redux-saga/effects';
import { AzureResource } from '../models/azureResource';
import { clearDevicesAction } from '../../devices/deviceList/actions';
import { clearModelDefinitionsAction } from '../../devices/deviceContent/actions';

export function* setActiveAzureResourceSaga(action: Action<AzureResource>) {
    yield put(clearDevicesAction());
    yield put(clearModelDefinitionsAction());
}
