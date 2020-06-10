/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'office-ui-fabric-react/lib/components/Button';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { getResourceNameFromHostName } from '../../api/shared/hostNameUtils';
import { ConnectionStringProperties } from './connectionStringProperties';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConnectionStringDelete } from './connectionStringDelete';
import { MaskedCopyableTextField } from '../../shared/components/maskedCopyableTextField';
import { EDIT, REMOVE } from '../../constants/iconNames';
import './connectionString.scss';

export interface ConnectionStringProps {
    connectionString: string;
    onEditConnectionString(connectionString: string): void;
    onDeleteConnectionString(connectionString: string): void;
    onSelectConnectionString(connectionString: string, hostName: string): void;
}

export const ConnectionString: React.FC<ConnectionStringProps> = props => {
    const { connectionString, onEditConnectionString, onDeleteConnectionString, onSelectConnectionString } = props;
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
        onSelectConnectionString(connectionString, hostName);
    };

    return (
        <div className="connection-string">
            <div className="commands">
                <div className="name">
                    <Link
                        className="text"
                        ariaLabel={t(ResourceKeys.connectionStrings.visitConnectionCommand.ariaLabel, {connectionString})}
                        onClick={onSelectConnectionStringClick}
                        title={t(ResourceKeys.connectionStrings.visitConnectionCommand.ariaLabel, {connectionString})}
                    >
                        {resourceName}
                    </Link>
                </div>
                <div className="actions">
                    <IconButton
                        iconProps={{
                            iconName: EDIT
                        }}
                        title={t(ResourceKeys.connectionStrings.editConnectionCommand.label)}
                        ariaLabel={t(ResourceKeys.connectionStrings.editConnectionCommand.ariaLabel, {connectionString})}
                        onClick={onEditConnectionStringClick}
                    />
                    <IconButton
                        iconProps={{
                            iconName: REMOVE
                        }}
                        title={t(ResourceKeys.connectionStrings.deleteConnectionCommand.label)}
                        ariaLabel={t(ResourceKeys.connectionStrings.deleteConnectionCommand.ariaLabel, {connectionString})}
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
                    readOnly={true}
                />
                <Link
                    style={{marginTop: 10}}
                    ariaLabel={t(ResourceKeys.connectionStrings.visitConnectionCommand.ariaLabel, {connectionString})}
                    onClick={onSelectConnectionStringClick}
                    title={t(ResourceKeys.connectionStrings.visitConnectionCommand.ariaLabel, {connectionString})}
                >
                    {t(ResourceKeys.connectionStrings.visitConnectionCommand.label)}
                </Link>
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
