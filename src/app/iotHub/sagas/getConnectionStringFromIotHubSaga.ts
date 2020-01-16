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
import { AuthorizationRuleNotFoundError } from '../../api/models/authorizationRuleNotFound.Error';

export function* getConnectionSTringFormIotHubSaga(azureResourceIdentifier: AzureResourceIdentifier) {
    const rules: SharedAccessSignatureAuthorizationRule[] = yield call(getSharedAccessSignatureAuthorizationRulesSaga, azureResourceIdentifier);
    const targetRule = rules.filter(s =>
        s.rights === AccessRights.RegistryWriteServiceConnectDeviceConnect ||
        s.rights === AccessRights.RegistryReadRegistryWriteServiceConnectDeviceConnect);

    if (targetRule.length === 0) {
        throw new AuthorizationRuleNotFoundError(AccessRights.RegistryWriteServiceConnectDeviceConnect.split(', '));
    }

    return `
        HostName=${azureResourceIdentifier.name}.${AzureResourceHostNameType.IotHub};
        SharedAccessKeyName=${targetRule[1].keyName};
        SharedAccessKey=${targetRule[0].primaryKey}
    `;
}
