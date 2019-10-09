/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { TranslationFunction } from 'i18next';
import Dialog, { DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface ConfirmationDialogProps {
    t: TranslationFunction;
    messageKey: string;
    onNo(): void;
    onYes(): void;
}

export const ConfirmationDialog: React.SFC<ConfirmationDialogProps> = (props: ConfirmationDialogProps) => {
    return (
        <Dialog
          hidden={false}
          onDismiss={props.onNo}
          dialogContentProps={{
            subText: props.t(props.messageKey),
            title: props.t(ResourceKeys.common.confirmationDialog.title),
            type: DialogType.normal,
          }}
          modalProps={{
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={props.onYes} text={props.t(ResourceKeys.common.confirmationDialog.yes)}/>
            <ActionButton onClick={props.onNo} text={props.t(ResourceKeys.common.confirmationDialog.no)} />
          </DialogFooter>
        </Dialog>
    );
};
