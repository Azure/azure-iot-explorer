/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Field, Input } from '@fluentui/react-components';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface ResizeColumnDialogProps {
    open: boolean;
    onResize: (width: number) => void;
    onDismiss: () => void;
}

export const ResizeColumnDialog: React.FC<ResizeColumnDialogProps> = ({ open, onResize, onDismiss }) => {
    const { t } = useTranslation();
    const [value, setValue] = React.useState<string>('');

    React.useEffect(() => {
        if (open) {
            setValue('');
        }
    }, [open]);

    const confirm = () => {
        const width = Number(value);
        if (width > 0) {
            onResize(width);
        }
        onDismiss();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(_e, data) => { if (!data.open) { onDismiss(); } }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{t(ResourceKeys.resizableDetailsList.content.title)}</DialogTitle>
                    <DialogContent>
                        <Field label={t(ResourceKeys.resizableDetailsList.content.subText)}>
                            <Input
                                type="number"
                                min={1}
                                value={value}
                                autoFocus={true}
                                onChange={(_e, data) => setValue(data.value)}
                                onKeyDown={onKeyDown}
                                aria-label={t(ResourceKeys.resizableDetailsList.content.subText)}
                            />
                        </Field>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={confirm}>{t(ResourceKeys.resizableDetailsList.buttons.resize)}</Button>
                        <Button onClick={onDismiss}>{t(ResourceKeys.resizableDetailsList.buttons.cancel)}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
