/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { call } from 'redux-saga/effects';
import { AzureResourceIdentifier } from '../../azureResourceIdentifier/models/azureResourceIdentifier';
import { getSharedAccessSignatureAuthorizationRulesSaga } from './getSharedAccessSignatureAuthorizationRulesSaga';
import { AccessRights } from '../models/accessRights';
import { SharedAccessSignatureAuthorizationRule } from '../models/sharedAccessSignatureAuthorizationRule';
import { AzureResourceHostNameType } from '../../azureResourceIdentifier/models/azureResourceHostNameType';
import { AuthorizationRuleNotFoundError } from '../../api/models/authorizationRuleNotFoundError';

export function* getConnectionStringFromIotHubSaga(azureResourceIdentifier: AzureResourceIdentifier) {
    const rules: SharedAccessSignatureAuthorizationRule[] = yield call(getSharedAccessSignatureAuthorizationRulesSaga, azureResourceIdentifier);
    const targetRules = rules.filter(s =>
        s.rights === AccessRights.RegistryWriteServiceConnectDeviceConnect ||
        s.rights === AccessRights.RegistryReadRegistryWriteServiceConnectDeviceConnect);

    if (targetRules.length === 0) {
        throw new AuthorizationRuleNotFoundError(AccessRights.RegistryWriteServiceConnectDeviceConnect.split(', '));
    }
    return `HostName=${azureResourceIdentifier.name}.${AzureResourceHostNameType.IotHub}.net;SharedAccessKeyName=${targetRules[0].keyName};SharedAccessKey=${targetRules[0].primaryKey}`;
}
