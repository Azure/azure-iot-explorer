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
});
