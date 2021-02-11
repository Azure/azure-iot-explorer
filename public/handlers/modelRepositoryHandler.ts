/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import { GetInterfaceDefinitionParameters, MODEL_PARSE_ERROR } from '../interfaces/modelRepositoryInterface';

// tslint:disable-next-line: cyclomatic-complexity
export const onGetInterfaceDefinition = (event: IpcMainInvokeEvent, { interfaceId, path }: GetInterfaceDefinitionParameters): object | undefined => {
    if (!interfaceId || path) {
        throw new Error();
    }

    const fileNames = fs.readdirSync(path);
    let parseErrors = 0;
    for (const fileName of fileNames) {
        if (!isFileExtensionJson(fileName)) {
            break;
        }

        try {
            const definition = getInterfaceDefinition(path, fileName, interfaceId);
            if (definition) {
                return definition;
            }
        } catch {
            parseErrors += 1;
        }
    }

    if (parseErrors > 0) {
        throw new Error(MODEL_PARSE_ERROR);
    }
};

export const getInterfaceDefinition = (filePath: string, fileName: string, interfaceId: string): object | undefined => {
    const data = readFileFromLocal(filePath, fileName);
    const parsedData = JSON.parse(data);
    if (Array.isArray(data)) {
        for (const pd of parsedData) {
            if (pd['@id']?.toString() === interfaceId) {
                return pd;
            }
        }
    } else if (data['@id']?.toString() === interfaceId)  {
        return parsedData;
    }
};

const readFileFromLocal = (filePath: string, fileName: string) => {
    return fs.readFileSync(`${filePath}/${fileName}`, 'utf-8');
};

const isFileExtensionJson = (fileName: string) => {
    const i = fileName.lastIndexOf('.');
    return i > 0 && fileName.substr(i) === '.json';
};
