/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Action } from 'typescript-fsa';
import { put, select, SelectEffect, CallEffect, PutEffect } from 'redux-saga/effects';
import { MILLISECONDS_IN_MINUTE } from '../../constants/shared';
import { getRepoConnectionInfoFromConnectionString, generatePnpSasToken } from '../../api/shared/utils';

import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getPrivateRepositorySettingsSelector } from '../selectors';
import { PrivateRepositorySettings } from '../state';
import { updateRepoTokenAction } from '../actions';

const ELAPSED_THRESHOLD_IN_MINUTES = 10;
const ELAPSED_BUFFER_IN_MINUTES = 0.5;

export function* getRepoTokenSaga(repoLocationType: REPOSITORY_LOCATION_TYPE): IterableIterator<SelectEffect | CallEffect | PutEffect<Action<PrivateRepositorySettings>>> {
    if (repoLocationType === REPOSITORY_LOCATION_TYPE.Public) {
        return undefined;
    }
    let state: PrivateRepositorySettings = yield select(getPrivateRepositorySettingsSelector);

    if (!state || state.privateConnectionString === '') {
        return undefined;
    }

    const elapsed = new Date().getTime() - state.privateRepoTimestamp + ELAPSED_BUFFER_IN_MINUTES * MILLISECONDS_IN_MINUTE;

    if (elapsed > (ELAPSED_THRESHOLD_IN_MINUTES * MILLISECONDS_IN_MINUTE)) {
        const repoObject = getRepoConnectionInfoFromConnectionString(state.privateConnectionString);
        const token = generatePnpSasToken(repoObject.repositoryId, repoObject.hostName, repoObject.sharedAccessKey, repoObject.sharedAccessKeyName);
        state =
            {   ...state,
                privateRepoTimestamp: new Date().getTime(),
                privateRepoToken: token
            };
        yield put(updateRepoTokenAction(state));
        return token;
    }

    return state.privateRepoToken;
}
