/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as ServerBase from './serverBase';

describe('serverBase', () => {
    const mockRequest = (bodyData?: any) => { // tslint:disable-line:no-any
        return { body: bodyData } as any; // tslint:disable-line:no-any
    };

    const mockResponse = () => {
        const res = {status: undefined, json: undefined, send: undefined};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as any;  // tslint:disable-line:no-any
    };

    context('handleDataPlanePostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await ServerBase.handleDataPlanePostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });
    });

    context('handlhandleCloudToDevicePostRequesteDataPlanePostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await ServerBase.handleCloudToDevicePostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });
    });

    describe('handleEventHubMonitorPostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await ServerBase.handleEventHubMonitorPostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });

        it('calls eventHubProvider when body is provided', async () => {
            const req = mockRequest({params: {}});
            const res = mockResponse();
            const promise = {then: jest.fn()} as any;  // tslint:disable-line:no-any
            jest.spyOn(ServerBase, 'eventHubProvider').mockReturnValue(promise);

            await ServerBase.handleEventHubMonitorPostRequest(req, res);
            expect(ServerBase.eventHubProvider).toBeCalled();
        });
    });

    context('handleModelRepoPostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();
            await ServerBase.handleModelRepoPostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });

        it('returns 500 if response is error', async () => {
            const req = mockRequest('test');
            const res = mockResponse();
            await ServerBase.handleModelRepoPostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(500); // tslint:disable-line:no-magic-numbers
        });
    });

    context('addPropertiesToCloudToDeviceMessage', () => {
        it('add system properties to message', async () => {
            const message: any = {properties: new Map()};  // tslint:disable-line:no-any
            const properties = [
                {
                    isSystemProperty: true,
                    key: 'ack',
                    value: '1',
                },
                {
                    isSystemProperty: true,
                    key: 'contentType',
                    value: 'json',
                },
                {
                    isSystemProperty: true,
                    key: 'correlationId',
                    value: '2',
                },
                {
                    isSystemProperty: true,
                    key: 'contentEncoding',
                    value: '3',
                },
                {
                    isSystemProperty: true,
                    key: 'expiryTimeUtc',
                    value: '4',
                },
                {
                    isSystemProperty: true,
                    key: 'messageId',
                    value: '5',
                },
                {
                    isSystemProperty: true,
                    key: 'lockToken',
                    value: '6',
                }
            ];
            ServerBase.addPropertiesToCloudToDeviceMessage(message, properties);
            expect(message.ack).toEqual('1');
            expect(message.contentType).toEqual('json');
            expect(message.correlationId).toEqual('2');
            expect(message.contentEncoding).toEqual('3');
            expect(message.expiryTimeUtc).toEqual(4); // tslint:disable-line:no-magic-numbers
            expect(message.messageId).toEqual('5');
            expect(message.lockToken).toEqual('6');
        });
    });

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
            jest.spyOn(ServerBase, 'readFileFromLocal').mockReturnValue(JSON.stringify(model));
            expect(ServerBase.findMatchingFile('', ['test.json'], 'urn:azureiot:test:ModelInformation;1')).toEqual(null);
        });

        it('returns model when @id and expected file name matches', async () => {
            jest.spyOn(ServerBase, 'readFileFromLocal').mockReturnValue(JSON.stringify(model));
            expect(ServerBase.findMatchingFile('', ['test.json'], 'urn:azureiot:ModelDiscovery:ModelInformation;1')).toEqual(JSON.stringify(model));
        });

        it('returns model when @id and expected file name matches and model is an array', async () => {
            jest.spyOn(ServerBase, 'readFileFromLocal').mockReturnValue(JSON.stringify([model]));
            expect(ServerBase.findMatchingFile('', ['test.json'], 'urn:azureiot:ModelDiscovery:ModelInformation;1')).toEqual(model);
        });
    });
});