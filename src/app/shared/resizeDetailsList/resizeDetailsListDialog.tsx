/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, IColumn, ITextField, PrimaryButton, TextField } from '@fluentui/react';

interface ResizeDetailsListDialog {
    columnToEdit: any; // tslint:disable-line: no-any
    detailsListRef: any; // tslint:disable-line: no-any
    isDialogHidden: boolean;
    setIsDialogHidden: (isDialogHidden: boolean) => void;
}

export const ResizeDetailsListDialog: React.FC<ResizeDetailsListDialog> = ({columnToEdit, detailsListRef, isDialogHidden, setIsDialogHidden}) => {
    const textfieldRef = React.useRef<ITextField>(null);
    const input = React.useRef<number | null>(null);

    const resizeDialogContentProps = {
        closeButtonAriaLabel: 'Close',
        subText: 'Enter desired column width pixels:',
        title: 'Resize Column',
        type: DialogType.normal
    };

    const dialogStyles = { main: { maxWidth: 450 } };
    const modalProps = {
        isBlocking: false,
        styles: dialogStyles,
        subtitleAriaId: 'Dialog sub',
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
                ariaLabel={'Enter column width'}
            />
            <DialogFooter>
                <PrimaryButton onClick={confirmDialog} text={'Resize'} />
                <DefaultButton onClick={hideDialog} text="Cancel" />
            </DialogFooter>
        </Dialog>
    );
};
