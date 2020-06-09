/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { testModelDefinition } from './testData';
import { getDeviceCommandPairs } from './dataHelper';

describe('getDeviceCommandPairs', () => {
    it('returns interface commands', () => {
        const commandSchemas = [
            {
                commandModelDefinition: {
                    '@type': 'Command',
                    'commandType': 'synchronous',
                    'description': 'This command will begin blinking the LED for given time interval.',
                    'name': 'blink',
                    'request': {
                        name: 'blinkRequest',
                        schema: 'long'
                    },
                    'response': {
                        name: 'blinkResponse',
                        schema: 'string'
                    }
                },
                parsedSchema: {
                    name: 'blink',
                    requestSchema: {
                        definitions: {},
                        required: [],
                        title: 'blinkRequest',
                        type: ['number', 'null']
                    },
                    responseSchema: {
                        definitions: {},
                        required: [],
                        title: 'blinkResponse',
                        type: 'string'
                    }
                }
            }
        ];
        expect(getDeviceCommandPairs(testModelDefinition))
            .toEqual({commandSchemas});
    });
});
