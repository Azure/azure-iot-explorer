/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { fetchLocalFile} from './localRepoService';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { MODEL_PARSE_ERROR } from '../../../../public/interfaces/modelRepositoryInterface';
import * as interfaceUtils from '../shared/interfaceUtils';

describe('fetchLocalFile', () => {
    it('returns file content when response is 200', async () => {
        // tslint:disable
        const content = {
            "@id": "urn:FlyYing:EnvironmentalSensor;1",
            "@type": "Interface",
            "@context": "http://azureiot.com/v1/contexts/IoTModel.json",
            displayName: "Environmental Sensor",
            description: "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
            comment: "Requires temperature and humidity sensors.",
            contents: [
                {
                    "@type": "Property",
                    displayName: "Device State",
                    description: "The state of the device. Two states online/offline are available.",
                    name: "state",
                    schema: "boolean"
                }
            ],
        };

        const getInterfaceDefinition = jest.fn().mockResolvedValue(content);
        jest.spyOn(interfaceUtils, 'getLocalModelRepositoryInterface').mockReturnValue({
            getInterfaceDefinition: jest.fn()
        });

        const result = await fetchLocalFile('f:', 'test.json');
        expect(getInterfaceDefinition).toHaveBeenCalledWith({ path: 'f:', interfaceId: 'test.json' });
        expect(result).toEqual(content);
    });

    // it('throws error when getInterfaceDefinition throws', async () => {
    //     const error = new Error('bad');
    //     const getInterfaceDefinition = jest.fn().mockImplementation(() => {throw error})
    //     jest.spyOn(interfaceUtils, 'getLocalModelRepositoryInterface').mockReturnValue({
    //         getInterfaceDefinition
    //     });

    //     await expect(fetchLocalFile('f:', 'test.json')).rejects.toThrow(error);
    // });

    // it('throws ModelDefinitionError on MODEL_PARSE_ERROR', async () => {
    //     const error = new Error(MODEL_PARSE_ERROR);
    //     const getInterfaceDefinition = jest.fn().mockImplementation(() => {throw { message: MODEL_PARSE_ERROR, data: { fileNames: ['file1', 'file2']}}})
    //     jest.spyOn(interfaceUtils, 'getLocalModelRepositoryInterface').mockReturnValue({
    //         getInterfaceDefinition
    //     });

    //     await expect(fetchLocalFile('f:', 'test.json')).rejects.toThrowError('M')
    // });
});

    // context('fetchDirectories', () => {
    //     it('returns array of drives when path is not provided', async done => {
    //         // tslint:disable
    //         const content = `Name  \r\n  C:    \r\n D:    \r\n \r\n  \r\n  `;
    //         const response = {
    //             status: 200,
    //             text: () => content,
    //             headers: {},
    //             ok: true
    //         } as any;
    //         // tslint:enable
    //         jest.spyOn(window, 'fetch').mockResolvedValue(response);

    //         const result = await LocalRepoService.fetchDirectories('');
    //         expect(result).toEqual(['C:/', 'D:/']);
    //         done();
    //     });

    //     it('returns array of folders when path is provided', async done => {
    //         // tslint:disable
    //         const content = ["documents", "pictures"];
    //         const response = {
    //             status: 200,
    //             json: () => content,
    //             headers: {},
    //             ok: true
    //         } as any;
    //         // tslint:enable
    //         jest.spyOn(window, 'fetch').mockResolvedValue(response);

    //         const result = await LocalRepoService.fetchDirectories('C:/');
    //         expect(result).toEqual(['documents', 'pictures']);
    //         done();
    //     });
    // });

