/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getInitialDeviceEventsState, DeviceEventsStateInterface, ContentTypeState } from './state';
import {
    startEventsMonitoringAction,
    stopEventsMonitoringAction,
    clearMonitoringEventsAction,
    setDecoderInfoAction,
    setDefaultDecodeInfoAction,
    setEventsMessagesAction
} from './actions';
import { MonitorEventsParameters, SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { Message } from '../../api/models/messages';

export const deviceEventsReducer = reducerWithInitialState<DeviceEventsStateInterface>(getInitialDeviceEventsState())
    .case(startEventsMonitoringAction.started, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'working'
        };
    })
    .case(startEventsMonitoringAction.done, (state: DeviceEventsStateInterface, payload: {params: MonitorEventsParameters}) => {
        return {
            ...state,
            formMode: 'fetched',
        };
    })
    .case(startEventsMonitoringAction.failed, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'failed'
        };
    })
    .case(stopEventsMonitoringAction.started, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'updating'
        };
    })
    .case(stopEventsMonitoringAction.done, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'upserted'
        };
    })
    .case(stopEventsMonitoringAction.failed, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'failed'
        };
    })
    .case(clearMonitoringEventsAction, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            message: []
        };
    })
    .case(setDecoderInfoAction.started, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'working'
        };
    })
    .case(setDecoderInfoAction.done, (state: DeviceEventsStateInterface, payload: {params: SetDecoderInfoParameters, result: ContentTypeState}) => {
        return {
            ...state,
            contentType: {
                decodeType: payload.result.decodeType,
                decoderProtoFile: payload.result.decoderProtoFile,
                decoderPrototype: payload.result.decoderPrototype,
            },
            formMode: 'setDecoderSucceeded'
        };
    })
    .case(setDecoderInfoAction.failed, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'setDecoderFailed'
        };
    })
    .case(setDefaultDecodeInfoAction, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            contentType: {
                decodeType: 'JSON'
            }
        };
    })
    .case(setEventsMessagesAction.started, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'working'
        };
    })
    .case(setEventsMessagesAction.done, (state: DeviceEventsStateInterface, payload: { params: Message[], result: Message[]}) => {
        const messages = payload.result ? payload.result.reverse().map((message: Message) => message) : [];
        return {
            ...state,
            formMode: 'fetched',
            message: [...messages, ...state.message]
        };
    })
    .case(setEventsMessagesAction.failed, (state: DeviceEventsStateInterface) => {
        return {
            ...state,
            formMode: 'failed'
        };
    });
