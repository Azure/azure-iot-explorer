import express = require('express');
import * as fs from 'fs';
import * as path from 'path';
import * as dns from 'dns';
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

const SAFE_ROOTS_WINDOWS = [
    "C:\\Users",      // User home directories
    "D:\\", "E:\\",   // Additional drives (non-system)
    "C:\\ProgramData", // Application-wide data storage
    "C:\\inetpub",    // IIS web server root
    "C:\\Temp"        // Temporary storage (watch for security concerns)
];

const SAFE_ROOTS_LINUX = [
    "/home",          // User home directories
    "/Users",         // macOS user home directories
    "/var/www",       // Web server content
    "/var/data",      // Common data storage
    "/srv",           // Server files
    "/opt",           // Optional software installs
    "/workspace",     // Dev environments
    "/app",           // Application root
    "/tmp", "/var/tmp" // Temporary storage (watch for security concerns)
];

const isPathSafe = (dir: string): string | null => {
    const resolvedPath = path.resolve(fs.realpathSync(dir));

    // Use platform-specific safe roots
    const safeRoots = process.platform === "win32" ? SAFE_ROOTS_WINDOWS : SAFE_ROOTS_LINUX;

    for (const root of safeRoots) {
        const resolvedRoot = path.resolve(root);

        if (resolvedPath.startsWith(resolvedRoot + path.sep)) {
            // Normalize the path within the safe root
            return path.resolve(resolvedRoot, path.relative(resolvedRoot, resolvedPath));
        }
    }

    return null; // Not in a safe root
};


export const fetchDirectories = (dir: string, res: express.Response) => {
    try {
        const safePath = isPathSafe(dir);

        if (!safePath) {
            return res.status(403).send({ error: `Access denied: Unsafe directory ${dir}.` });
        }

        const result: string[] = [];
        for (const item of fs.readdirSync(safePath)) {
            try {
                const itemPath = fs.realpathSync(path.join(safePath, item));

                // Ensure itemPath is still within safePath
                if (itemPath.startsWith(safePath + path.sep)) {
                    const stat = fs.statSync(itemPath);
                    if (stat.isDirectory()) {
                        result.push(item);
                    }
                }
            } catch {
                // Ignore errors and continue
            }
        }

        res.status(200).send(result);
    } catch {
        res.status(500).send({ error: 'Failed to fetch directories.' });
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

export const isSafeUrl = async (userUrl: string): Promise<boolean> => {
    try {
        const parsedUrl = new URL(userUrl);

        // Enforce HTTPS
        if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
            return false;
        }

        // Resolve DNS to check IP addresses
        const addresses = await dns.promises.resolve(parsedUrl.hostname);

        // Block local and private IPs
        for (const address of addresses) {
            if (
                address.startsWith('127.') ||            // Loopback
                address.startsWith('10.') ||             // Private
                address.startsWith('192.168.') ||        // Private
                address.startsWith('169.254.') ||        // Link-local
                address === '0.0.0.0' ||                 // Unspecified
                address === '::1' ||                     // IPv6 loopback
                address.startsWith('fe80:') ||           // IPv6 link-local
                address.startsWith('fc00:') ||           // IPv6 unique local
                address.startsWith('fd00:')              // IPv6 unique local
            ) {
                return false;
            }
        }

        return true;
    } catch {
        return false;
    }
};