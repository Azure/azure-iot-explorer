import { DEFAULT_DIRECTORY } from "../../constants/apiConstants";
import { getProtoFileInterface } from "../shared/interfaceUtils";

/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 export const fetchProtoFiles = async (path: string): Promise<string[]> => {
    const api = getProtoFileInterface();
    const result = await api.getProtoFiles({path: path || DEFAULT_DIRECTORY});
    return result;
};

export const loadProtoFile = async (path: string) => {
    const api = getProtoFileInterface();
    await api.loadProtoFile({path: path});
};
