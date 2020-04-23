/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const getHeaderValue = (response: Response, headerName: string, undefinedValue: string = ''): string => {
    if (!response || !response.headers || !headerName) {
        return undefined;
    }

    return response.headers.has(headerName) ? response.headers.get(headerName) : undefined;
};
