/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { GetDirectoriesParameters } from '../interfaces/directoryInterface';

export const onGetDirectories = (event: IpcMainInvokeEvent, params: GetDirectoriesParameters): string[] => {
    return params.path === '$DEFAULT' ?
        fetchDrivesOnWindows() :
        fetchDirectories(params.path);
};

const fetchDrivesOnWindows = (): string[] => {
    const exec = require('child_process').exec;
    exec('wmic logicaldisk get name', (error: any, stdout: any, stderr: any) => { // tslint:disable-line:no-any
        if (!error && !stderr) {
            return stdout as string[];
        }
    });

    throw new Error();
};

const fetchDirectories = (dir: string): string[] => {
    const result: string[] = [];
    for (const item of fs.readdirSync(dir)) {
        try {
            const stat = fs.statSync(path.join(dir, item));
            if (stat.isDirectory()) {
                result.push(item);
            }
        }
        catch {
            // some item cannot be checked by isDirectory(), swallow error and continue the loop
        }
    }
    return result;
};
