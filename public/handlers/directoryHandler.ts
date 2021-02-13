/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as child_process from 'child_process';
import { GetDirectoriesParameters } from '../interfaces/directoryInterface';

export const onGetDirectories = async (event: IpcMainInvokeEvent, params: GetDirectoriesParameters): Promise<string[]> => {
    return params.path === '$DEFAULT' ?
        await fetchDrivesOnWindows() :
        Promise.resolve(fetchDirectories(params.path));
};

const fetchDrivesOnWindows = async (): Promise<string[]> => {
    const promise = util.promisify(child_process.exec);
    const {stdout} = await promise('wmic logicaldisk get name')
    if (stdout) {
        const drives = stdout.split(/\r\n/).map(drive => drive.trim()).filter(drive => drive !== '');
        drives.shift(); // remove header
        return drives.map(drive => `${drive}/`);
    }

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
