/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import semver from 'semver';
export const isNewReleaseVersionHigher = (releaseVersion: string, appVersion: string) => {
    return true;

    // return semver.gt(releaseVersion, appVersion);
};
