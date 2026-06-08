/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogActions } from '@fluentui/react-components';
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

export const ConnectionStringDelete: React.FC<ConnectionStringDeleteProps> = (props: ConnectionStringDeleteProps) => {
    const { connectionString, hidden, onDeleteCancel, onDeleteConfirm } = props;
    const { t } = useTranslation();

    return (
        <Dialog
            open={!hidden}
            onOpenChange={(e, data) => { if (!data.open) {onDeleteCancel();} }}
            modalType="alert"
        >
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t(ResourceKeys.connectionStrings.deleteConnection.title)}</DialogTitle>
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
                    <DialogActions>
                        <Button
                            appearance="primary"
                            onClick={onDeleteConfirm}
                            aria-label={t(ResourceKeys.connectionStrings.deleteConnection.yes.ariaLabel, {connectionString})}
                        >
                            {t(ResourceKeys.connectionStrings.deleteConnection.yes.label)}
                        </Button>
                        <Button
                            onClick={onDeleteCancel}
                            aria-label={t(ResourceKeys.connectionStrings.deleteConnection.no.ariaLabel, {connectionString})}
                        >
                            {t(ResourceKeys.connectionStrings.deleteConnection.no.label)}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
