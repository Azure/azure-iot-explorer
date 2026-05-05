/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Field, Label, Link, OverlayDrawer, Textarea } from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import { ConnectionStringProperties } from './connectionStringProperties';
import { getConnectionInfoFromConnectionString } from '../../api/shared/utils';
import { generateConnectionStringValidationError } from '../../shared/utils/hubConnectionStringHelper';
import { IoTHubConnectionSettings } from '../../api/services/devicesService';
import { ResourceKeys } from '../../../localization/resourceKeys';
import { ConnectionStringWithExpiry } from '../state';
import './connectionStringEditView.scss';

const LINES_FOR_CONNECTION = 8;

export interface ConnectionStringEditViewProps {
    connectionStringUnderEdit: string;
    connectionStrings: ConnectionStringWithExpiry[];
    onDismiss(): void;
    onCommit(newConnectionString: string): void;
}

export const ConnectionStringEditView: React.FC<ConnectionStringEditViewProps> = (props: ConnectionStringEditViewProps) => {
    const {connectionStringUnderEdit, connectionStrings, onDismiss, onCommit} = props;
    const [connectionString, setConnectionString] = React.useState<string>(connectionStringUnderEdit);
    const [connectionStringValidationKey, setConnectionStringValidationKey] = React.useState<string>(undefined);
    const [connectionSettings, setConnectionSettings] = React.useState<IoTHubConnectionSettings>(undefined);
    const { t } = useTranslation();

    React.useEffect(() => {
        if (connectionString) {
            validateConnectionString(connectionString);
        }
    }, []); // tslint:disable-line:align

    const onConnectionStringChange = (event: React.ChangeEvent<HTMLTextAreaElement>, data: { value: string }) => {
         setConnectionString(data.value);
         validateConnectionString(data.value);
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
        validationKey = (connectionStrings.filter(s => s.connectionString === updatedConnectionString).length > 0 &&
            updatedConnectionString !== connectionStringUnderEdit) ?
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

    return (
        <OverlayDrawer
            open={true}
            position="end"
            size="medium"
            onOpenChange={(e, data) => { if (!data.open) {onDismiss();} }}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            icon={<DismissRegular />}
                            onClick={onDismissClick}
                            aria-label={
                                connectionStringUnderEdit ?
                                    t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.edit) :
                                    t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.add)
                            }
                        />
                    }
                >
                    <span style={{ textAlign: 'right', display: 'block' }}>
                        {connectionStringUnderEdit ?
                            t(ResourceKeys.connectionStrings.editConnection.title.edit) :
                            t(ResourceKeys.connectionStrings.editConnection.title.add)
                        }
                    </span>
                </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody>
                <div className="connection-string-edit-body">
                    <Field
                        label={<Label weight="semibold">{t(ResourceKeys.connectionStrings.editConnection.editField.label)}</Label>}
                        validationMessage={connectionStringValidationKey ? t(connectionStringValidationKey) : undefined}
                        validationState={connectionStringValidationKey ? 'error' : 'none'}
                        required={true}
                    >
                        <Textarea
                            aria-label={t(ResourceKeys.connectionStrings.editConnection.editField.ariaLabel)}
                            onChange={onConnectionStringChange}
                            rows={LINES_FOR_CONNECTION}
                            value={connectionString}
                            placeholder={t(ResourceKeys.connectionStrings.editConnection.editField.placeholder)}
                        />
                    </Field>
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
            </DrawerBody>
            <DrawerFooter>
                <Button
                    appearance="primary"
                   onClick={onCommitClick}
                   aria-label={t(ResourceKeys.connectionStrings.editConnection.save.ariaLabel)}
                   disabled={connectionStringValidationKey !== ''}
                >
                    {t(ResourceKeys.connectionStrings.editConnection.save.label)}
                </Button>
                <Button
                   aria-label={connectionStringUnderEdit ?
                        t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.edit) :
                        t(ResourceKeys.connectionStrings.editConnection.cancel.ariaLabel.add)
                    }
                   onClick={onDismissClick}
                >
                    {t(ResourceKeys.connectionStrings.editConnection.cancel.label)}
                </Button>
            </DrawerFooter>
        </OverlayDrawer>
    );
};
