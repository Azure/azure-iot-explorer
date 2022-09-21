/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { Message } from '../../api/models/messages';

export type FormMode = 'fetched' | 'initialized' | 'upserted' | 'working' | 'failed' | 'updating' | 'setDecoderSucceeded' | 'setDecoderFailed';

export interface ContentTypeState {
    isContentTypeCustomized: boolean;
    decoderProtoFile?: File;
    decoderPrototype?: Type;
}

export interface DeviceEventsStateInterface {
    message: Message[];
    contentType: ContentTypeState;
    formMode: FormMode;
}

export const getInitialDeviceEventsState = (): DeviceEventsStateInterface => ({
    contentType: {
        isContentTypeCustomized: false
    },
    formMode: 'initialized',
    message: []
});
