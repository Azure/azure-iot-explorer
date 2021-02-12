/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { DEFAULT_DIRECTORY } from './../../constants/apiConstants';
import { fetchLocalFile, fetchDirectories } from './localRepoService';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';
import { ModelDefinitionNotValidJsonError } from '../models/modelDefinitionNotValidJsonError';
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
            getInterfaceDefinition
        });

        const result = await fetchLocalFile('f:', 'test.json');
        expect(getInterfaceDefinition).toHaveBeenCalledWith({ path: 'f:', interfaceId: 'test.json' });
        expect(result).toEqual(content);
    });

    it('throws error when getInterfaceDefinition throws', async () => {
        const error = new Error('bad');
        const getInterfaceDefinition = jest.fn().mockImplementation(() => {throw error})
        jest.spyOn(interfaceUtils, 'getLocalModelRepositoryInterface').mockReturnValue({
            getInterfaceDefinition
        });

        try {
           await fetchLocalFile('f:', 'test.json');
           expect(true).toEqual(false);
        } catch(e) {
            expect(e instanceof ModelDefinitionNotFound).toEqual(true);
        }
    });

    it('throws ModelDefinitionError on MODEL_PARSE_ERROR', async () => {
        const fileNames = ['file1', 'file2'];
        const getInterfaceDefinition = jest.fn().mockImplementation(() => {throw { message: MODEL_PARSE_ERROR, data: { fileNames }}})
        jest.spyOn(interfaceUtils, 'getLocalModelRepositoryInterface').mockReturnValue({
            getInterfaceDefinition
        });

        try {
            await fetchLocalFile('f:', 'test.json');
            expect(true).toEqual(false);
         } catch(e) {
            expect(e instanceof ModelDefinitionNotValidJsonError).toEqual(true);
            expect(e.message).toEqual(JSON.stringify(fileNames));
         }
    });
});

describe('fetchDirectories', () => {
    it('calls api.fetchDirectories with expected parameters when path is falsy', async () => {
        const getDirectories = jest.fn().mockResolvedValue(['a','b','c']);
        jest.spyOn(interfaceUtils, 'getDirectoryInterface').mockReturnValue({
            getDirectories
        });

        const result = await fetchDirectories('');
        expect(result).toEqual(['a', 'b', 'c']);
        expect(getDirectories).toHaveBeenCalledWith({ path: DEFAULT_DIRECTORY });
    });

    it('calls api.fetchDirectories with expected parameters when path is truthy', async () => {
        const getDirectories = jest.fn().mockResolvedValue(['a','b','c']);
        jest.spyOn(interfaceUtils, 'getDirectoryInterface').mockReturnValue({
            getDirectories
        });

        const result = await fetchDirectories('path');
        expect(result).toEqual(['a', 'b', 'c']);
        expect(getDirectories).toHaveBeenCalledWith({ path: 'path'});
    });
});
