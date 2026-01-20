import express = require('express');
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
var escape = require('escape-html');
import { SERVER_ERROR, SUCCESS } from './serverBase';

// Restrict to current user's home directory only (not all users)
export const SAFE_ROOT = os.homedir();

// Allowed file extensions for read operations
const ALLOWED_EXTENSIONS = ['.json'];

// Maximum directory depth to prevent deep traversal
const MAX_DIRECTORY_DEPTH = 10;

export const fetchDrivesOnWindows = (res: express.Response) => {
    // Instead of exposing all drives, only return the safe root
    // This prevents information disclosure about system drive layout
    res.status(SUCCESS).send(SAFE_ROOT);
};


export const fetchDirectories = (dir: string, res: express.Response) => {
    try {
        const resolvedPath = checkPath(dir);

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
    // Validate file extension before reading
    if (!checkFileExtension(fileName)) {
        throw new Error("Access denied. File type not allowed.");
    }
    
    // Resolve the requested directory relative to the safe root
    const resolvedPath = checkPath(`${filePath}/${fileName}`);
    
    // Additional symlink check for the final file
    const realFilePath = fs.realpathSync(resolvedPath);
    const normalizedSafeRoot = path.normalize(SAFE_ROOT);
    if (!realFilePath.startsWith(normalizedSafeRoot + path.sep)) {
        throw new Error("Access denied. Symlink points outside allowed directory.");
    }
    
    return fs.readFileSync(realFilePath, 'utf-8');
}

export const checkPath = (filePath: string) => {
    // Normalize the path first to handle different separators
    const normalizedInput = path.normalize(filePath);
    
    // Resolve to absolute path
    const resolvedPath = path.resolve(SAFE_ROOT, normalizedInput);
    
    // Get the real path (resolves symlinks) - wrap in try-catch for non-existent paths
    let realPath: string;
    try {
        realPath = fs.realpathSync(resolvedPath);
    } catch {
        // If path doesn't exist yet, use resolved path but still validate
        realPath = resolvedPath;
    }

    // Normalize SAFE_ROOT for comparison
    const normalizedSafeRoot = path.normalize(SAFE_ROOT);
    
    // Ensure realPath starts with SAFE_ROOT (prevents traversal attacks)
    // Use path.sep to ensure we match directory boundaries
    if (!realPath.startsWith(normalizedSafeRoot + path.sep) && realPath !== normalizedSafeRoot) {
        throw new Error("Access denied. Path is outside allowed directory.");
    }

    // Check directory depth to prevent deep traversal
    const relativePath = path.relative(normalizedSafeRoot, realPath);
    const depth = relativePath.split(path.sep).filter((p: string) => p && p !== '.').length;
    if (depth > MAX_DIRECTORY_DEPTH) {
        throw new Error("Access denied. Path exceeds maximum allowed depth.");
    }

    return realPath;
}

// Validate that a file has an allowed extension
export const checkFileExtension = (fileName: string): boolean => {
    const ext = path.extname(fileName).toLowerCase();
    return ALLOWED_EXTENSIONS.indexOf(ext) >= 0;
}
