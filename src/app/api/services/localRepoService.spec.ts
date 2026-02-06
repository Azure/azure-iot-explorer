/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { fetchLocalFile, fetchDirectories, fetchLocalFileNaive } from './localRepoService';
import { ModelDefinitionNotFound } from '../models/modelDefinitionNotFoundError';

describe('localRepoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchLocalFile', () => {
        it('calls IPC readLocalFile with expected params', async () => {
            const mockFileContent = { test: 'content' };
            (window as any).api_device.readLocalFile.mockResolvedValue(JSON.stringify(mockFileContent));

            const result = await fetchLocalFile('f:', 'test.json');
            expect((window as any).api_device.readLocalFile).toHaveBeenCalledWith({ path: 'f:', file: 'test.json' });
            expect(result).toEqual(mockFileContent);
        });

        it('throws ModelDefinitionNotFound when file is not found (null)', async () => {
            (window as any).api_device.readLocalFile.mockResolvedValue(null);
            await expect(fetchLocalFile('f:', 'test.json')).rejects.toThrow(new ModelDefinitionNotFound());
        });
    });

    describe('fetchLocalFileNaive', () => {
        it('calls IPC readLocalFileNaive with expected params', async () => {
            const mockFileContent = { test: 'naive' };
            (window as any).api_device.readLocalFileNaive.mockResolvedValue(JSON.stringify(mockFileContent));

            const result = await fetchLocalFileNaive('f:', 'test.json');
            expect((window as any).api_device.readLocalFileNaive).toHaveBeenCalledWith({ path: 'f:', file: 'test.json' });
            expect(result).toEqual(mockFileContent);
        });

        it('throws ModelDefinitionNotFound when file content is empty/null', async () => {
            (window as any).api_device.readLocalFileNaive.mockResolvedValue(null);
            await expect(fetchLocalFileNaive('f:', 'test.json')).rejects.toThrow(new ModelDefinitionNotFound());
        });
    });

    describe('fetchDirectories', () => {
        it('calls IPC getDirectories with expected params', async () => {
            const mockDirectories = ['dir1', 'dir2'];
            (window as any).api_device.getDirectories.mockResolvedValue(mockDirectories);

            const result = await fetchDirectories('f:');
            expect((window as any).api_device.getDirectories).toHaveBeenCalledWith({ path: 'f:' });
            expect(result).toEqual(mockDirectories);
        });
    });
});
