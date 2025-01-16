import express = require('express');
import * as fs from 'fs';
import * as path from 'path';
import { SERVER_ERROR, SUCCESS } from './serverBase';

export const fetchDrivesOnWindows = (res: express.Response) => {
    const exec = require('child_process').exec;
    exec('wmic logicaldisk get name', (error: any, stdout: any, stderr: any) => { // tslint:disable-line:no-any
        if (!error && !stderr) {
            res.status(SUCCESS).send(stdout);
        }
        else {
            res.status(SERVER_ERROR).send();
        }
    });
};

export const fetchDirectories = (dir: string, res: express.Response) => {
    const result: string[] = [];
    const resolvedPath = fs.realpathSync(dir, { encoding: "utf8" }); 

    for (const item of fs.readdirSync(resolvedPath)) {
        try {
            const root = path.resolve(dir);
            const filePath = fs.realpathSync(path.resolve(dir, item));

            if (filePath.startsWith(root)) {
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    result.push(item);
                }
            }
        }
        catch {
            // some item cannot be checked by isDirectory(), swallow error and continue the loop
        }
    }
    res.status(SUCCESS).send(result);
};

// tslint:disable-next-line:cyclomatic-complexity
export const findMatchingFile = (filePath: string, fileNames: string[], expectedFileName: string): string => {
    const filesWithParsingError = [];
    for (const fileName of fileNames) {
        if (isFileExtensionJson(fileName)) {
            try {
                const data = readFileFromLocal(filePath, fileName);
                const parsedData = JSON.parse(data);
                if (parsedData) {
                    if (Array.isArray(parsedData)) { // if parsedData is array, it is using expanded dtdl format
                        for (const pd of parsedData) {
                            if (pd['@id']?.toString() === expectedFileName) {
                                return pd;
                            }
                        }
                    }
                    else {
                        if (parsedData['@id']?.toString() === expectedFileName) {
                            return data;
                        }
                    }
                }
            }
            catch (error) {
                filesWithParsingError.push(`${fileName}: ${error.message}`); // swallow error and continue the loop
            }
        }
    }
    if (filesWithParsingError.length > 0) {
        throw new Error(filesWithParsingError.join(', '));
    }
    return null;
};

const isFileExtensionJson = (fileName: string) => {
    const i = fileName.lastIndexOf('.');
    return i > 0 && fileName.substr(i) === '.json';
};

export const readFileFromLocal = (filePath: string, fileName: string) => {
    return fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');
}
