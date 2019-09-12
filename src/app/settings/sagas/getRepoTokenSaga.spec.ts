/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { getRepoTokenSaga } from './getRepoTokenSaga';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getPrivateRepositorySettingsSelector } from '../selectors';
import { PrivateRepositorySettings } from '../state';
import { getRepoConnectionInfoFromConnectionString, generatePnpSasToken } from '../../api/shared/utils';

describe('getRepoTokenSaga in public repo', () => {
    let getRepoTokenSagaGenerator;
    beforeAll(() => {
        getRepoTokenSagaGenerator = cloneableGenerator(getRepoTokenSaga)(REPOSITORY_LOCATION_TYPE.Public);
    });

    it('get public repo token', () => {
        expect(getRepoTokenSagaGenerator.next()).toEqual({
            done: true,
            value: undefined
        });
    });
});

describe('getRepoTokenSaga in private repo', () => {
    let getRepoTokenSagaGenerator;

    beforeAll(() => {
        getRepoTokenSagaGenerator = cloneableGenerator(getRepoTokenSaga)(REPOSITORY_LOCATION_TYPE.Private);
    });

    it('get private repo token', () => {
        expect(getRepoTokenSagaGenerator.next()).toEqual({
            done: false,
            value: select(getPrivateRepositorySettingsSelector)
        });

        let mockState: PrivateRepositorySettings = {
            privateConnectionString: '',
            privateRepoTimestamp: undefined,
            privateRepoToken: 'token'
        };

        const getRepoStateNoConnectionStringClone = getRepoTokenSagaGenerator.clone();
        expect(getRepoStateNoConnectionStringClone.next(mockState)).toEqual({
            done: true,
            value: undefined
        });

        mockState = {
            ...mockState,
            privateConnectionString: 'HostName=test.azureiotrepository.com;RepositoryId=123;SharedAccessKeyName=456;SharedAccessKey=789',
            privateRepoTimestamp: new Date().getTime()
        };
        const getRepoStateValidTimeStampClone = getRepoTokenSagaGenerator.clone();
        expect(getRepoStateValidTimeStampClone.next(mockState)).toEqual({
            done: true,
            value: mockState.privateRepoToken
        });

        const getRepoStateExpiredTimeStampClone = getRepoTokenSagaGenerator.clone();
        const repoObject = getRepoConnectionInfoFromConnectionString(mockState.privateConnectionString);
        const token = generatePnpSasToken(repoObject.repositoryId, repoObject.hostName, repoObject.sharedAccessKey, repoObject.sharedAccessKeyName);
        mockState =
            {   ...mockState,
                privateRepoTimestamp: new Date('1995-12-17T03:24:00').getTime(),
                privateRepoToken: token
            };
        expect(getRepoStateExpiredTimeStampClone.next(mockState).done).toEqual(false); // cannot test value because timestamp generated could be different

        expect(getRepoStateExpiredTimeStampClone.next().done).toEqual(true);
        expect(getRepoStateExpiredTimeStampClone.next().token).not.toEqual('token');
    });
});
