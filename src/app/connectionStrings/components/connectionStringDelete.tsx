/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/components/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';
import { ResourceKeys } from '../../../localization/resourceKeys';
import './connectionStringDelete.scss';

const ROWS_FOR_CONNECTION = 8;
const COLS_FOR_CONNECTION = 40;

export interface ConnectionStringDeleteProps {
    connectionString: string;
    hidden: boolean;
    onDeleteConfirm(): void;
    onDeleteCancel(): void;
}

export const ConnectionStringDelete: React.FC<ConnectionStringDeleteProps> = props => {
    const { connectionString, hidden, onDeleteCancel, onDeleteConfirm } = props;
    const { t } = useTranslation();

    return (
        <Dialog
            hidden={hidden}
            onDismiss={onDeleteCancel}
            dialogContentProps={{
                title: t(ResourceKeys.connectionStrings.deleteConnection.title)
            }}
            modalProps={{
                isBlocking: true
            }}
        >
            <div className="connection-string-delete">
            <div>{t(ResourceKeys.connectionStrings.deleteConnection.body)}</div>
                <textarea
                    readOnly={true}
                    aria-label={t(ResourceKeys.connectionStrings.deleteConnection.input)}
                    cols={COLS_FOR_CONNECTION}
                    rows={ROWS_FOR_CONNECTION}
                    value={connectionString}
                />
            </div>
            <DialogFooter>
                <PrimaryButton
                    onClick={onDeleteConfirm}
                    ariaLabel={t(ResourceKeys.connectionStrings.deleteConnection.yes.ariaLabel, {connectionString})}
                    text={t(ResourceKeys.connectionStrings.deleteConnection.yes.label)}
                />
                <DefaultButton
                    onClick={onDeleteCancel}
                    ariaLabel={t(ResourceKeys.connectionStrings.deleteConnection.no.ariaLabel, {connectionString})}
                    text={t(ResourceKeys.connectionStrings.deleteConnection.no.label)}
                />
            </DialogFooter>
        </Dialog>
    );
};
