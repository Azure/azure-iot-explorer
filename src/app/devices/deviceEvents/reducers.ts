/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceEventsStateInterface, deviceEventsStateInitial, DeviceEventsStateType } from './state';
import {
    startEventsMonitoringAction,
    stopEventsMonitoringAction,
    clearMonitoringEventsAction,
    setDecoderInfoAction,
    validateDecoderInfoAction
} from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { MonitorEventsParameters, SetDecoderInfoParameters, ValidateDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { Message } from '../../api/models/messages';

export const deviceEventsReducer = reducerWithInitialState<DeviceEventsStateInterface>(deviceEventsStateInitial())
    .case(startEventsMonitoringAction.started, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(startEventsMonitoringAction.done, (state: DeviceEventsStateType, payload: {params: MonitorEventsParameters, result: Message[]}) => {
        const messages = payload.result ? payload.result.reverse().map((message: Message) => message) : [];
        let filteredMessages = messages;
        if (state.message.payload?.length > 0 && messages.length > 0) {
            // filter overlaped messages returned from event hub
            filteredMessages = messages.filter(message => message.enqueuedTime > state.message.payload[0].enqueuedTime);
        }
        return state.merge({
            message: {
                payload: [...filteredMessages, ...state.message.payload],
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(startEventsMonitoringAction.failed, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(stopEventsMonitoringAction.started, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(stopEventsMonitoringAction.done, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(stopEventsMonitoringAction.failed, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                synchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(clearMonitoringEventsAction, (state: DeviceEventsStateType) => {
        return state.merge({
            message: {
                payload: [],
                synchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(validateDecoderInfoAction, (state: DeviceEventsStateType, payload: ValidateDecoderInfoParameters) => {
        const hasError = (payload.decoderPrototype === undefined);
        return state.merge({
            decoder: {
                payload: {
                    decoderProtoFile: payload.decoderFile,
                    decoderPrototype: payload.decoderPrototype,
                    hasError,
                },
                synchronizationStatus: SynchronizationStatus.updating
            }
        });
    });
    // .case(setDecoderInfoAction, (state: DeviceEventsStateType, payload: SetDecoderInfoParameters) => {
    //     return state.merge({
    //         decoderProtoFile: payload.decoderFile
    //     });
    // });
