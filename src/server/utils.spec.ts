/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as Utils from './utils';

describe('Utils', () => { 
    context('findMatchingFile', () => {
        const model = {
            '@id': 'urn:azureiot:ModelDiscovery:ModelInformation;1',
            '@type': 'Interface',
            'displayName': 'Digital Twin Client SDK Information',
            'contents': [
                {
                    '@type': 'Property',
                    'name': 'language',
                    'displayName': 'SDK Language',
                    'schema': 'string',
                    'description': 'The language for the Digital Twin client SDK. For example, Java.'
                }
            ],
            '@context': 'http://azureiot.com/v1/contexts/IoTModel.json'
        };

        it('returns null when @id and expected file name does not match', async () => {
            jest.spyOn(Utils, 'readFileFromLocal').mockReturnValue(JSON.stringify(model));
            expect(Utils.findMatchingFile('', ['test.json'], 'urn:azureiot:test:ModelInformation;1')).toEqual(null);
        });

        it('returns model when @id and expected file name matches', async () => {
            jest.spyOn(Utils, 'readFileFromLocal').mockReturnValue(JSON.stringify(model));
            expect(Utils.findMatchingFile('', ['test.json'], 'urn:azureiot:ModelDiscovery:ModelInformation;1')).toEqual(JSON.stringify(model));
        });

        it('returns model when @id and expected file name matches and model is an array', async () => {
            jest.spyOn(Utils, 'readFileFromLocal').mockReturnValue(JSON.stringify([model]));
            expect(Utils.findMatchingFile('', ['test.json'], 'urn:azureiot:ModelDiscovery:ModelInformation;1')).toEqual(model);
        });
    });
});