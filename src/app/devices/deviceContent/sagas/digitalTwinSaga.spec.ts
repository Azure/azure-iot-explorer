/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { SagaIteratorClone, cloneableGenerator } from 'redux-saga/utils';
import { call, put } from 'redux-saga/effects';
import { getDigitalTwinSaga } from './digitalTwinSaga';
import { getDigitalTwinAction } from '../actions';
import { getActiveAzureResourceConnectionStringSaga } from '../../../azureResource/sagas/getActiveAzureResourceConnectionStringSaga';
import * as DigitalTwinService from '../../../api/services/digitalTwinService';

describe('digitalTwinSaga', () => {
    let getDigitalTwinSagaGenerator: SagaIteratorClone;

    const connectionString = 'connection_string';
    const digitalTwinId = 'device_id';

    /* tslint:disable */
    const digitalTwin = {
        "$dtId": "testDevice",
        "environmentalSensor": {
        "state": true,
        "$metadata": {
            "state": {
            "lastUpdateTime": "2020-03-31T23:17:42.4813073Z"
            }
        }
        },
        "$metadata": {
        "$model": "urn:azureiot:samplemodel:1"
        }
    };
    /* tslint:enable */

    describe('getDigitalTwinSaga', () => {

        beforeAll(() => {
            getDigitalTwinSagaGenerator = cloneableGenerator(getDigitalTwinSaga)(getDigitalTwinAction.started(digitalTwinId));
        });

        const mockFetchDigitalTwin = jest.spyOn(DigitalTwinService, 'fetchDigitalTwin').mockImplementationOnce(parameters => {
            return null;
        });

        it('fetches the connection string', () => {
            expect(getDigitalTwinSagaGenerator.next()).toEqual({
                done: false,
                value: call(getActiveAzureResourceConnectionStringSaga)
            });
        });

        it('fetches the digital twin', () => {
            expect(getDigitalTwinSagaGenerator.next(connectionString)).toEqual({
                done: false,
                value: call(mockFetchDigitalTwin, { connectionString, digitalTwinId })
            });
        });

        it('puts the successful action', () => {
            const success = getDigitalTwinSagaGenerator.clone();
            expect(success.next(digitalTwin)).toEqual({
                done: false,
                value: put(getDigitalTwinAction.done({params: digitalTwinId, result: digitalTwin}))
            });
            expect(success.next().done).toEqual(true);
        });

        it('fails on error', () => {
            const failure = getDigitalTwinSagaGenerator.clone();
            const error = { code: -1 };

            expect(failure.throw(error)).toEqual({
                done: false,
                value: put(getDigitalTwinAction.failed({params: digitalTwinId, error}))
            });

            expect(failure.next().done).toEqual(true);
        });
    });

});
