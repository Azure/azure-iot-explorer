/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as LocalRepoService from './localRepoService';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
describe('localRepoService', () => {

    context('fetchLocalFile', () => {
        it('returns file content when response is 200', async done => {
            // tslint:disable
            const content = {
                "@id": "urn:FlyYing:EnvironmentalSensor:1",
                "@type": "Interface",
                "displayName": "Environmental Sensor",
                "description": "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
                "comment": "Requires temperature and humidity sensors.",
                "contents": [
                    {
                    "@type": "Property",
                    "displayName": "Device State",
                    "description": "The state of the device. Two states online/offline are available.",
                    "name": "state",
                    "schema": "boolean"
                    }
                ],
                "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
                };
            const response = {
                status: 200,
                json: () => content,
                headers: {},
                ok: true
            } as any;
            // tslint:enable
            jest.spyOn(window, 'fetch').mockResolvedValue(response);

            const result = await LocalRepoService.fetchLocalFile('f:/test.json');
            expect(result).toEqual(content);
            done();
        });

        it('throw when response is 404', async done => {
            window.fetch = jest.fn().mockRejectedValueOnce(new ModelDefinitionNotFound('Not found'));
            await expect(LocalRepoService.fetchLocalFile('f:/test.json')).rejects.toThrowError('Not found');
            done();
        });
    });
});
