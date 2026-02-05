/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { CONTROLLER_API_ENDPOINT, GET_DIRECTORIES, READ_FILE, READ_FILE_NAIVE } from './../../constants/apiConstants';
import { fetchLocalFile, fetchDirectories, fetchLocalFileNaive } from './localRepoService';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';

describe('localRepoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchLocalFile', () => {
        it('calls fetch with expected params', async () => {
            // tslint:disable
            const response = {
                json: () => {
                    return { headers:{}, body:{}}
                    },
                status: 200
            } as any;
            // tslint:enable
            (window.fetch as jest.Mock).mockResolvedValue(response);

            await fetchLocalFile('f:', 'test.json');
            expect(fetch).toHaveBeenLastCalledWith(`${CONTROLLER_API_ENDPOINT}${READ_FILE}/${encodeURIComponent('f:')}/${encodeURIComponent('test.json')}`, undefined);
        });

        it('throws ModelDefinitionNotFound when response status is 500', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: {},
                    headers:{}
                    }},
                status: 500
            } as any;
            // tslint:enable
            (window.fetch as jest.Mock).mockResolvedValue(response);
            await expect(fetchLocalFile('f:', 'test.json')).rejects.toThrow(new ModelDefinitionNotFound()).catch();
        });
    });

    describe('fetchLocalFileNaive', () => {
        it('calls fetch with expected params', async () => {
            // tslint:disable
            const response = {
                json: () => {
                    return { headers:{}, body:{}}
                    },
                status: 200
            } as any;
            // tslint:enable
            (window.fetch as jest.Mock).mockResolvedValue(response);

            await fetchLocalFileNaive('f:', 'test.json');
            expect(fetch).toHaveBeenLastCalledWith(`${CONTROLLER_API_ENDPOINT}${READ_FILE_NAIVE}/${encodeURIComponent('f:')}/${encodeURIComponent('test.json')}`, undefined);
        });

        it('throws ModelDefinitionNotFound when response status is 500', async () => {
            // tslint:disable
            const response = {
                json: () => {return {
                    body: {},
                    headers:{}
                    }},
                status: 500
            } as any;
            // tslint:enable
            (window.fetch as jest.Mock).mockResolvedValue(response);
            await expect(fetchLocalFileNaive('f:', 'test.json')).rejects.toThrow(new ModelDefinitionNotFound()).catch();
        });
    });

    describe('fetchDirectories', () => {
        it('calls fetch with expected params', async () => {
            // tslint:disable
            const response = {
                json: () => {
                    return { headers:{}, body:{}}
                    },
                status: 200
            } as any;
            // tslint:enable
            (window.fetch as jest.Mock).mockResolvedValue(response);

            await fetchDirectories('f:');
            expect(fetch).toHaveBeenLastCalledWith(`${CONTROLLER_API_ENDPOINT}${GET_DIRECTORIES}/${encodeURIComponent('f:')}`, undefined);
        });
    });
});
