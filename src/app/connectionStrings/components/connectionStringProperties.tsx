/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MaskedCopyableTextField } from '../../shared/components/maskedCopyableTextField';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface ConnectionStringPropertiesProps {
    connectionString: string;
    hostName: string;
    sharedAccessKey: string;
    sharedAccessKeyName: string;
}

export const ConnectionStringProperties: React.FC<ConnectionStringPropertiesProps> = props => {
    const { connectionString, hostName, sharedAccessKey, sharedAccessKeyName} = props;
    const { t } = useTranslation();

    return (
        <>
            <MaskedCopyableTextField
                ariaLabel={t(ResourceKeys.connectionStrings.properties.hostName.ariaLabel, {connectionString})}
                allowMask={false}
                label={t(ResourceKeys.connectionStrings.properties.hostName.label)}
                value={hostName}
                readOnly={true}
            />

            <MaskedCopyableTextField
                ariaLabel={t(ResourceKeys.connectionStrings.properties.sharedAccessPolicyName.ariaLabel, {connectionString})}
                allowMask={false}
                label={t(ResourceKeys.connectionStrings.properties.sharedAccessPolicyName.label)}
                value={sharedAccessKeyName}
                readOnly={true}
            />

            <MaskedCopyableTextField
                ariaLabel={t(ResourceKeys.connectionStrings.properties.sharedAccessPolicyKey.ariaLabel, {connectionString})}
                allowMask={true}
                label={t(ResourceKeys.connectionStrings.properties.sharedAccessPolicyKey.label)}
                value={sharedAccessKey}
                readOnly={true}

            />
        </>
    );
};
