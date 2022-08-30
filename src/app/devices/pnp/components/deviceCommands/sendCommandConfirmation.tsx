/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import * as React from 'react';
 import { useTranslation } from 'react-i18next';
 import { Dialog, DialogFooter, PrimaryButton, DefaultButton } from '@fluentui/react';
 import { ResourceKeys } from '../../../../../localization/resourceKeys';

 export interface SendCommandConfirmationProps {
     hidden: boolean;
     onSendConfirm(): void;
     onSendCancel(): void;
 }

 export const SendCommandConfirmation: React.FC<SendCommandConfirmationProps> = (props: SendCommandConfirmationProps) => {
     const { hidden, onSendCancel, onSendConfirm } = props;
     const { t } = useTranslation();

     return (
         <Dialog
             hidden={hidden}
             onDismiss={onSendCancel}
             dialogContentProps={{
                 title: t(ResourceKeys.deviceCommands.confirmSend.title)
             }}
             modalProps={{
                 isBlocking: true
             }}
         >
             <div>{t(ResourceKeys.deviceCommands.confirmSend.body)}</div>
             <DialogFooter>
                 <PrimaryButton
                     onClick={onSendConfirm}
                     ariaLabel={t(ResourceKeys.deviceCommands.confirmSend.yes.ariaLabel)}
                     text={t(ResourceKeys.deviceCommands.confirmSend.yes.label)}
                 />
                 <DefaultButton
                     onClick={onSendCancel}
                     ariaLabel={t(ResourceKeys.deviceCommands.confirmSend.no.ariaLabel)}
                     text={t(ResourceKeys.deviceCommands.confirmSend.no.label)}
                 />
             </DialogFooter>
         </Dialog>
     );
 };
