import express = require('express');
import * as fs from 'fs';
import * as path from 'path';
var escape = require('escape-html');
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

// Dynamically determine a "Safe Root Directory"
const getSafeRoot = (): string => {
    if (process.platform === "win32") {
        return "C:\\Users"; // Restrict access to user directories only
    }
    return "/home"; // Restrict access to home directories on Linux/macOS
};

export const SAFE_ROOT = getSafeRoot();


export const fetchDirectories = (dir: string, res: express.Response) => {
    try {
        // Resolve the requested directory relative to the safe root
        const resolvedPath = fs.realpathSync(path.resolve(SAFE_ROOT, path.relative(SAFE_ROOT, dir)));

        // Ensure resolvedPath is still inside SAFE_ROOT (prevents traversal attacks)
        if (!resolvedPath.startsWith(SAFE_ROOT)) {
            return res.status(403).send({ error: "Access denied. Unsafe directory." });
        }

        const result: string[] = [];
        for (const item of fs.readdirSync(resolvedPath)) {
            try {
                const itemPath = fs.realpathSync(path.join(resolvedPath, item));

                // Ensure itemPath is still inside resolvedPath (protects against symlink attacks)
                if (itemPath.startsWith(resolvedPath + path.sep)) {
                    const stat = fs.statSync(itemPath);
                    if (stat.isDirectory()) {
                        result.push(escape(item));
                    }
                }
            } catch {
                // Ignore errors and continue
            }
        }

        res.status(200).send(result);
    } catch {
        res.status(500).send({ error: "Failed to fetch directories." });
    }
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
