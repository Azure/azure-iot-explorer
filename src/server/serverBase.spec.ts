/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';

// Mock request-filtering-agent before importing ServerBase
jest.mock('request-filtering-agent', () => ({
    useAgent: jest.fn((url: string) => ({ mock: true, url }))
}));

import { ServerBase } from './serverBase';

describe('serverBase', () => {
    let serverInstance: ServerBase;

    beforeEach(() => {
        // Create a server instance for testing
        serverInstance = new ServerBase(8081);
    });

    const mockRequest = (bodyData?: any) => { // tslint:disable-line:no-any
        return { body: bodyData } as any; // tslint:disable-line:no-any
    };

    const mockResponse = () => {
        const res = {status: undefined, json: undefined, send: undefined} as any; // tslint:disable-line:no-any
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res as any; // tslint:disable-line:no-any
    };

    context('handleDataPlanePostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            // Access the private method through any cast for testing
            await (serverInstance as any).handleDataPlanePostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });
    });

    describe('handleEventHubMonitorPostRequest', () => {
        it('returns 400 if body is not provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            // Access the private method through any cast for testing
            await (serverInstance as any).handleEventHubMonitorPostRequest(req, res);
            expect(res.status).toHaveBeenCalledWith(400); // tslint:disable-line:no-magic-numbers
        });
    });
});