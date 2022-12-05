/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as semver from 'semver';
export const isNewReleaseVersionHigher = (releaseVersion: string, appVersion: string) => {
    return semver.gt(releaseVersion, appVersion);
};
