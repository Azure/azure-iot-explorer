/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link } from '@fluentui/react-components';
import { EditRegular, DeleteRegular, ArrowForwardRegular } from '@fluentui/react-icons';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { getResourceNameFromHostName } from '../../api/shared/hostNameUtils';
import { ConnectionStringProperties } from './connectionStringProperties';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConnectionStringDelete } from './connectionStringDelete';
import { MaskedCopyableTextField } from '../../shared/components/maskedCopyableTextField';
import { ConnectionStringWithExpiry } from '../state';
import { CONNECTION_STRING_EXPIRATION_WARNING_IN_DAYS } from '../../constants/browserStorage';
import { getDaysBeforeHubConnectionStringExpires } from '../../shared/utils/hubConnectionStringHelper';
import './connectionString.scss';

export interface ConnectionStringProps {
    connectionStringWithExpiry: ConnectionStringWithExpiry;
    onEditConnectionString(connectionString: string): void;
    onDeleteConnectionString(connectionString: string): void;
    onSelectConnectionString(connectionString: string): void;
}

export const ConnectionString: React.FC<ConnectionStringProps> = (props: ConnectionStringProps) => {
    const { connectionStringWithExpiry, onEditConnectionString, onDeleteConnectionString, onSelectConnectionString } = props;
    const connectionString = connectionStringWithExpiry.connectionString;
    const daysTillExpire = getDaysBeforeHubConnectionStringExpires(connectionStringWithExpiry);
    const connectionSettings = getConnectionInfoFromConnectionString(connectionString);
    const { hostName, sharedAccessKey, sharedAccessKeyName } = connectionSettings;
    const resourceName = getResourceNameFromHostName(hostName);
    const [ confirmingDelete, setConfirmingDelete ] = React.useState<boolean>(false);
    const { t } = useTranslation();

    const onEditConnectionStringClick = () => {
        onEditConnectionString(connectionString);
    };

    const onDeleteConnectionStringClick = () => {
        setConfirmingDelete(true);
    };

    const onDeleteConnectionStringConfirm = () => {
        setConfirmingDelete(false);
        onDeleteConnectionString(connectionString);
    };

    const onDeleteConnectionStringCancel = () => {
        setConfirmingDelete(false);
    };

    const onSelectConnectionStringClick = () => {
        onSelectConnectionString(connectionString);
    };

    return (
        <div className="connection-string">
            <div className="commands">
                <div className="name">
                    <Link
                        className="text"
                        onClick={onSelectConnectionStringClick}
                        title={t(ResourceKeys.connectionStrings.visitConnectionCommand.ariaLabel, {connectionString})}
                    >
                        {resourceName}
                    </Link>
                </div>
                <div className="actions">
                    <Button
                        appearance="subtle"
                        icon={<EditRegular />}
                        title={t(ResourceKeys.connectionStrings.editConnectionCommand.label)}
                        aria-label={t(ResourceKeys.connectionStrings.editConnectionCommand.ariaLabel, {connectionString})}
                        onClick={onEditConnectionStringClick}
                    />
                    <Button
                        appearance="subtle"
                        icon={<DeleteRegular />}
                        title={t(ResourceKeys.connectionStrings.deleteConnectionCommand.label)}
                        aria-label={t(ResourceKeys.connectionStrings.deleteConnectionCommand.ariaLabel, {connectionString})}
                        onClick={onDeleteConnectionStringClick}
                    />
                </div>
            </div>

            <div className="properties">
                <ConnectionStringProperties
                    connectionString={connectionString}
                    hostName={hostName}
                    sharedAccessKey={sharedAccessKey}
                    sharedAccessKeyName={sharedAccessKeyName}
                />
                <MaskedCopyableTextField
                    ariaLabel={t(ResourceKeys.connectionStrings.properties.connectionString.ariaLabel)}
                    allowMask={true}
                    label={t(ResourceKeys.connectionStrings.properties.connectionString.label)}
                    value={connectionString}
                />
                {daysTillExpire <= CONNECTION_STRING_EXPIRATION_WARNING_IN_DAYS &&
                    <div className="expiration-warning">
                        {t(ResourceKeys.connectionStrings.expirationWarning, { numberOfDays: daysTillExpire})}
                    </div>}
                <Button
                    appearance="transparent"
                    onClick={onSelectConnectionStringClick}
                    icon={<ArrowForwardRegular />}
                >
                    {t(ResourceKeys.connectionStrings.visitConnectionCommand.label)}
                </Button>
            </div>
            <ConnectionStringDelete
                connectionString={connectionString}
                hidden={!confirmingDelete}
                onDeleteCancel={onDeleteConnectionStringCancel}
                onDeleteConfirm={onDeleteConnectionStringConfirm}
            />
        </div>
    );
};
