/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/components/Panel';
import { TextField } from 'office-ui-fabric-react/lib/components/TextField';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/components/Button';
import { Link } from 'office-ui-fabric-react/lib/components/Link';
import { ConnectionStringProperties } from './connectionStringProperties';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { generateConnectionStringValidationError } from '../../shared/utils/hubConnectionStringHelper';
import { IoTHubConnectionSettings } from '../../api/services/devicesService';
import { useLocalizationContext } from '../../shared/contexts/localizationContext';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './connectionStringEditView.scss';

const LINES_FOR_CONNECTION = 8;

export interface ConnectionStringEditViewProps {
    connectionStringUnderEdit?: string;
    connectionStrings: string[];
    onDismiss(): void;
    onCommit(newConnectionString: string): void;
}

export const ConnectionStringEditView: React.FC<ConnectionStringEditViewProps> = props => {
    const {connectionStringUnderEdit, connectionStrings, onDismiss, onCommit} = props;
    const [connectionString, setConnectionString] = React.useState<string>(connectionStringUnderEdit);
    const [connectionStringValidationKey, setConnectionStringValidationKey] = React.useState<string>(undefined);
    const [connectionSettings, setConnectionSettings] = React.useState<IoTHubConnectionSettings>(undefined);
    const { t } = useLocalizationContext();

    React.useEffect(() => {
        if (connectionString) {
            validateConnectionString(connectionString);
        }
    }, []); // tslint:disable-line:align

    const onConnectionStringChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
         setConnectionString(newValue);
         validateConnectionString(newValue);
    };

    const onCommitClick = () => {
        onCommit(connectionString);
    };

    const onDismissClick = () => {
        onDismiss();
    };

    const validateConnectionString = (updatedConnectionString: string) => {
        let validationKey = generateConnectionStringValidationError(updatedConnectionString) || '';

        if (!validationKey) {
            const extractedConnectionSettings = getConnectionInfoFromConnectionString(updatedConnectionString);
            setConnectionSettings(extractedConnectionSettings);
        }

        // check for duplicates and validate || after setting values (so properties display)
        validationKey = (connectionStrings.indexOf(updatedConnectionString) >= 0  && updatedConnectionString !== connectionStringUnderEdit) ?
        ResourceKeys.connectionStrings.editConnection.validations.duplicate :
        validationKey;

        setConnectionStringValidationKey(validationKey);
    };

    const showProperties = (): boolean => {
        if (!connectionSettings) {
            return false;
        }

        if (connectionStringValidationKey && connectionStringValidationKey !== ResourceKeys.connectionStrings.editConnection.validations.duplicate) {
            return false;
        }

        return true;
    };

    const renderHeader = (): JSX.Element => {
        return (
            <h2 className="connection-string-edit-header">
                {connectionStringUnderEdit ?
                    t(ResourceKeys.connectionStrings.editConnection.title.edit) :
                    t(ResourceKeys.connectionStrings.editConnection.title.add)
                }
            </h2>
        );
    };

    const renderFooter = (): JSX.Element => {
        return (
            <div className="connection-string-edit-footer">
                <PrimaryButton
                   text={t(ResourceKeys.connectionStrings.editConnection.save.label)}
                   ariaLabel={t(ResourceKeys.connectionStrings.editConnection.save.ariaLabel)}
                   onClick={onCommitClick}
                   disabled={connectionStringValidationKey !== ''}
                />
                <DefaultButton
                   text={t(ResourceKeys.connectionStrings.editConnection.cancel.label)}
                   ariaLabel={connectionStringUnderEdit ?
                        t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.edit) :
                        t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.add)
                    }
                   onClick={onDismissClick}
                />
            </div>
        );
    };

    return (
        <Panel
            isOpen={true}
            type={PanelType.medium}
            isBlocking={true}
            isFooterAtBottom={true}
            onRenderHeader={renderHeader}
            onRenderFooter={renderFooter}
            onDismiss={onDismiss}
            closeButtonAriaLabel={
                connectionStringUnderEdit ?
                    t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.edit) :
                    t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.add)
            }
        >
            <div className="connection-string-edit-body">
                <TextField
                    ariaLabel={t(ResourceKeys.connectionStrings.editConnection.editField.ariaLabel)}
                    label={t(ResourceKeys.connectionStrings.editConnection.editField.label)}
                    onChange={onConnectionStringChange}
                    multiline={true}
                    rows={LINES_FOR_CONNECTION}
                    errorMessage={t(connectionStringValidationKey)}
                    value={connectionString}
                    required={true}
                    placeholder={t(ResourceKeys.connectionStrings.editConnection.editField.placeholder)}
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
                {showProperties() &&
                    <div className="details">
                        <ConnectionStringProperties
                            connectionString={connectionString}
                            hostName={connectionSettings.hostName}
                            sharedAccessKey={connectionSettings.sharedAccessKey}
                            sharedAccessKeyName={connectionSettings.sharedAccessKeyName}
                        />
                    </div>
                }
            </div>
        </Panel>
    );
};
