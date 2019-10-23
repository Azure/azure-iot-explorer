/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

const latestReleasePath = 'Azure/azure-iot-explorer/releases/latest';
export const latestReleaseApiPath = `https://api.github.com/repos/${latestReleasePath}`;
export const latestReleaseUrlPath = `https://github.com/${latestReleasePath}`;

export const fetchLatestReleaseTagName = async (): Promise<string> => {
    try {
        const response = await fetch(latestReleaseApiPath);
        const result = await response.json();
        const tagName = 'tag_name';
        return result[tagName];
    } catch (error) {
        // swallow the exception
        return undefined;
    }
};
