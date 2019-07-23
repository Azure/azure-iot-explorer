/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export enum NotificationType {
    info,
    warning,
    success,
    error,
}

export interface Notification {
    id?: number;
    issued?: string;
    title?: {
        translationKey: string;
        translationOptions?: {}
    };
    text: {
        translationKey: string;
        translationOptions?: {};
    };
    type: NotificationType;
}
