/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import { ProtoFileInterface, GetProtoFilesParameters, LoadProtoFileParameters } from '../../../../public/interfaces/protoFileInterface';
 import { LOAD_PROTO_FILE, CONTROLLER_API_ENDPOINT, DEFAULT_DIRECTORY, GET_PROTO_FILES } from '../../constants/apiConstants';

export class ProtoFileServiceHandler implements ProtoFileInterface {
    public getProtoFiles = async (params: GetProtoFilesParameters): Promise<string[]> => {
        const response = await fetch(`${CONTROLLER_API_ENDPOINT}${GET_PROTO_FILES}/${encodeURIComponent(params.path)}`);
        if (params.path === DEFAULT_DIRECTORY) {
            // only possible when platform is windows, expecting drives to be returned
            const responseText = await response.text();
            const drives = responseText.split(/\r\n/).map(drive => drive.trim()).filter(drive => drive !== '');
            drives.shift(); // remove header
            return drives.map(drive => `${drive}/`); // add trailing slash for drives
        }
        else {
            return response.json();
        }
    }

    public loadProtoFile = async (params: LoadProtoFileParameters) => {
        await fetch(`${CONTROLLER_API_ENDPOINT}${LOAD_PROTO_FILE}/${encodeURIComponent(params.path)}`);
    }
}
