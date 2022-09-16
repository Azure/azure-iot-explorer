/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { Type } from 'protobufjs';
import { IM } from '../../shared/types/types';
import { SynchronizationWrapper } from '../../api/models/synchronizationWrapper';
import { Message } from '../../api/models/messages';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';

export interface DecoderState {
    decoderProtoFile?: File;
    decoderPrototype?: Type;
    hasError?: boolean;
}

export interface MessagaState extends SynchronizationWrapper<Message[]>{}

export interface DeviceEventsStateInterface {
    message: MessagaState;
    decoder: SynchronizationWrapper<DecoderState>;
}

export const deviceEventsStateInitial = Record<DeviceEventsStateInterface>({
    decoder: {
        payload: null,
        synchronizationStatus: SynchronizationStatus.initialized
    },
    message: {
        payload: [],
        synchronizationStatus: SynchronizationStatus.initialized
    }
});
export type DeviceEventsStateType = IM<DeviceEventsStateInterface>;
