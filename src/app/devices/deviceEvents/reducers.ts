/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceEventsStateInterface, deviceEventsStateInitial, DeviceEventsStateType } from './state';
import { startEventsMonitoringAction, clearMonitoringEventsAction, stopEventsMonitoringAction } from './actions';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { MonitorEventsParameters } from '../../api/parameters/deviceParameters';
import { Message } from '../../api/models/messages';

export const deviceEventsReducer = reducerWithInitialState<DeviceEventsStateInterface>(deviceEventsStateInitial())
    .case(startEventsMonitoringAction.started, (state: DeviceEventsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.working
        });
    })
    .case(startEventsMonitoringAction.done, (state: DeviceEventsStateType, payload: {params: MonitorEventsParameters, result: Message[]}) => {
        const messages = payload.result ? payload.result.reverse().map((message: Message) => message) : [];
        let filteredMessages = messages;
        if (state.payload.length > 0 && messages.length > 0) {
            // filter overlaped messages returned from event hub
            filteredMessages = messages.filter(message => new Date(message.enqueuedTime) >= payload.params.startTime || state.payload[0].enqueuedTime);
        }
        return state.merge({
            payload: [...filteredMessages, ...state.payload],
            synchronizationStatus: SynchronizationStatus.fetched
        });
    })
    .case(startEventsMonitoringAction.failed, (state: DeviceEventsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.failed
        });
    })
    .case(stopEventsMonitoringAction, (state: DeviceEventsStateType) => {
        return state.merge({
            synchronizationStatus: SynchronizationStatus.upserted
        });
    })
    .case(clearMonitoringEventsAction, (state: DeviceEventsStateType) => {
        return state.merge({
            payload: []
        });
    });
