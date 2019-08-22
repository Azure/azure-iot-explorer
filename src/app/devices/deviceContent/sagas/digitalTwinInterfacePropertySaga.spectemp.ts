/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { getDigitalTwinInterfacePropertySaga } from './digitalTwinInterfacePropertySaga';
import { getDigitalTwinInterfacePropertiesAction } from '../actions';
import * as DevicesService from '../../../api/services/devicesService';

describe('digitalTwinInterfacePropertySaga', () => {
    let getDigitalTwinInterfacePropertySagaGenerator: SagaIteratorClone;

    const digitalTwinId = 'device_id';

    describe('getDigitalTwinInterfacePropertySaga', () => {
        beforeAll(() => {
            getDigitalTwinInterfacePropertySagaGenerator = cloneableGenerator(getDigitalTwinInterfacePropertySaga)(getDigitalTwinInterfacePropertiesAction.started(digitalTwinId));
        });

        const mockFetchDigitalTwinInterfaceProperties = jest.spyOn(DevicesService, 'fetchDigitalTwinInterfaceProperties').mockImplementationOnce(parameters => {
            return null;
        });
    });
});
