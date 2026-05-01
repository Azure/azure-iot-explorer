/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
 import * as React from 'react';
 import { useTranslation } from 'react-i18next';
 import { Button, Dialog, DialogSurface, DialogBody, DialogTitle, DialogActions } from '@fluentui/react-components';
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
             open={!hidden}
             onOpenChange={(e, data) => { if (!data.open) onSendCancel(); }}
             modalType="alert"
         >
             <DialogSurface>
                 <DialogBody>
                     <DialogTitle>{t(ResourceKeys.deviceCommands.confirmSend.title)}</DialogTitle>
                     <div>{t(ResourceKeys.deviceCommands.confirmSend.body)}</div>
                     <DialogActions>
                         <Button
                             appearance="primary"
                             onClick={onSendConfirm}
                             aria-label={t(ResourceKeys.deviceCommands.confirmSend.yes.ariaLabel)}
                         >
                             {t(ResourceKeys.deviceCommands.confirmSend.yes.label)}
                         </Button>
                         <Button
                             onClick={onSendCancel}
                             aria-label={t(ResourceKeys.deviceCommands.confirmSend.no.ariaLabel)}
                         >
                             {t(ResourceKeys.deviceCommands.confirmSend.no.label)}
                         </Button>
                     </DialogActions>
                 </DialogBody>
             </DialogSurface>
         </Dialog>
     );
 };
