/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton, Dialog, DialogFooter, DialogType, IColumn, IDetailsList, ITextField, PrimaryButton, TextField } from '@fluentui/react';
import { ResourceKeys } from '../../../localization/resourceKeys';

interface ResizeDetailsListDialog {
    columnToEdit: React.MutableRefObject<IColumn>;
    detailsListRef: React.MutableRefObject<IDetailsList>;
    isDialogHidden: boolean;
    setIsDialogHidden: (isDialogHidden: boolean) => void;
}

export const ResizeDetailsListDialog: React.FC<ResizeDetailsListDialog> = ({columnToEdit, detailsListRef, isDialogHidden, setIsDialogHidden}) => {
    const { t } = useTranslation();
    const textfieldRef = React.useRef<ITextField>(null);
    const input = React.useRef<number | null>(null);

    const resizeDialogContentProps = {
        closeButtonAriaLabel: 'Close',
        subText: t(ResourceKeys.resizableDetailsList.content.subText),
        title: t(ResourceKeys.resizableDetailsList.content.title),
        type: DialogType.normal
    };

    const modalProps = {
        isBlocking: false,
        styles: { main: { maxWidth: 450 } },
        titleAriaId: 'Dialog'
    };

    const hideDialog = () => setIsDialogHidden(true);

    const confirmDialog = () => {
        const detailsList = detailsListRef.current;

        if (textfieldRef.current) {
            input.current = Number(textfieldRef.current.value);
        }
        if (columnToEdit.current && input.current && detailsList) {
            const width = input.current;
            detailsList.updateColumn(columnToEdit.current, { width });
        }

        input.current = null;
        hideDialog();
    };

    return (
        <Dialog
            hidden={isDialogHidden}
            onDismiss={hideDialog}
            dialogContentProps={resizeDialogContentProps}
            modalProps={modalProps}
        >
            <TextField
                componentRef={textfieldRef}
                ariaLabel={t(ResourceKeys.resizableDetailsList.content.subText)}
            />
            <DialogFooter>
                <PrimaryButton onClick={confirmDialog} text={t(ResourceKeys.resizableDetailsList.buttons.resize)} />
                <DefaultButton onClick={hideDialog} text={t(ResourceKeys.resizableDetailsList.buttons.cancel)} />
            </DialogFooter>
        </Dialog>
    );
};
