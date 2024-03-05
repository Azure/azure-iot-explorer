/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, PrimaryButton, Link } from '@fluentui/react';
import { generateConnectionStringValidationError } from '../../shared/utils/hubConnectionStringHelper';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { useConnectionStringContext } from '../context/connectionStringContext';
import { ROUTE_PARTS } from '../../constants/routes';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';

export const ConnectionStringEditView: React.FC = () => {
    const [ {connectionString}, {setConnectionString} ] = useConnectionStringContext();
    const [ stringInEdit, setStringInEdit] = React.useState<string>(undefined);
    const [connectionStringValidationKey, setConnectionStringValidationKey] = React.useState<string>(undefined);
    const history = useHistory();
    const { t } = useTranslation();

    const onConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setStringInEdit(newValue);
        validateConnectionString(newValue);
    };

    const onCommitClick = () => {
        setConnectionString(stringInEdit || connectionString);
        const hostName = getConnectionInfoFromConnectionString(stringInEdit || connectionString).hostName;
        history.push(`/${ROUTE_PARTS.IOT_HUB}/${ROUTE_PARTS.HOST_NAME}/${hostName}/`);
    };

    const validateConnectionString = (updatedConnectionString: string) => {
        const validationKey = generateConnectionStringValidationError(updatedConnectionString) || '';
        setConnectionStringValidationKey(validationKey);
    };

    const renderFooter = (): JSX.Element => {
        return (
            <PrimaryButton
                text={t(ResourceKeys.connectionStrings.editConnection.save.label)}
                ariaLabel={t(ResourceKeys.connectionStrings.editConnection.save.ariaLabel)}
                onClick={onCommitClick}
                disabled={!!connectionStringValidationKey}
            />
        );
    };

    return (
        <div style={{padding: 20}}>
            <TextField
                ariaLabel={t(ResourceKeys.connectionStrings.editConnection.editField.ariaLabel)}
                label={t(ResourceKeys.connectionStrings.editConnection.editField.label)}
                onChange={onConnectionStringChange}
                errorMessage={connectionStringValidationKey && t(connectionStringValidationKey)}
                value={stringInEdit || connectionString}
                required={true}
                placeholder={t(ResourceKeys.connectionStrings.editConnection.editField.placeholder)}
                canRevealPassword={true}
                type={'password'}
            />
            <Link
                href={t(ResourceKeys.connectivityPane.connectionStringComboBox.link)}
                target="_blank"
            >
                {t(ResourceKeys.connectivityPane.connectionStringComboBox.linkText)}
            </Link>
            <div>
                <span>{t(ResourceKeys.connectivityPane.connectionStringComboBox.warning)}</span>
            </div>
            {renderFooter()}
        </div>
    );
};
