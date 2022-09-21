/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Type } from 'protobufjs';
import { Message } from '../../api/models/messages';

export type FormMode = 'fetched' | 'initialized' | 'upserted' | 'working' | 'failed' | 'updating' | 'setDecoderSucceeded' | 'setDecoderFailed';

export interface DecoderState {
    isDecoderCustomized: boolean;
    decoderProtoFile?: File;
    decoderPrototype?: Type;
}

export interface DeviceEventsStateInterface {
    message: Message[];
    decoder: DecoderState;
    formMode: FormMode;
}

export const getInitialDeviceEventsState = (): DeviceEventsStateInterface => ({
    decoder: {
        isDecoderCustomized: false
    },
    formMode: 'initialized',
    message: []
});
