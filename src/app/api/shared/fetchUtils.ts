/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const getHeaderValue = (response: { headers: Headers }, headerName: string, undefinedValue: string = ''): string => {
    if (!response || !response.headers || !headerName) {
        return undefinedValue;
    }

    return response.headers.has(headerName) ? response.headers.get(headerName) : undefinedValue;
};

export const throwHttpErrorWhenResponseNotOk = async (response: Response) => {
    if (!response.ok) {
        const error = await getHttpErrorFromResponse(response);
        throw error;
    }
};

export const getHttpErrorFromResponse = async (response: Response): Promise<Error> => {
    let message: string | object = await response.text();

    try {
        message = JSON.stringify(JSON.parse(message), null, 2); // tslint:disable-line:no-magic-numbers
    } catch {
       // intentionally blank
    }

    return new Error(message);
};
