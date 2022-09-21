/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { parseEventHubMessage } from './eventHubMessageHelper';

describe('eventHubMessageHelper', () => {

    context('parseEventHubMessage', () => {
        it('converts body data if type if Buffer', async () => {
            /* tslint:disable */
            const message = {
                body: {
                    type: 'Buffer',
                    data: [
                        116,
                        101,
                        115,
                        116
                    ]
                },
                enqueuedTime: '2019-10-16T23:47:07.517Z',
                properties: {}
            };
            /* tslint:enable */
            expect(await parseEventHubMessage(message)).toEqual({
                body: 'test',
                enqueuedTime: '2019-10-16T23:47:07.517Z',
                properties: {}
            });
        });

        it('leaves body data intact if type if not Buffer', async () => {
            expect(await parseEventHubMessage(null)).toEqual(null);

            /* tslint:disable */
            const message = {
                body: {
                    id: '29c9223d-a04b-4e39-ad23-d2e22064179d',
                    timestamp: '2019-10-16 23:55:22.381412',
                    data: 'Ping from Az CLI IoT Extension #3'
                },
                enqueuedTime: '2019-10-16T23:55:22.162Z',
                properties: {}
            };
            /* tslint:enable */
            expect(await parseEventHubMessage(message)).toEqual(message);
        });
    });
});
