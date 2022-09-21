/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { CLEAR_MONITORING_EVENTS, REMOVE_DECODE_INFO, SET_DECODE_INFO, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING } from '../../constants/actionTypes';
import { Message } from '../../api/models/messages';
import { MonitorEventsParameters, SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { DecoderState } from './state';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
export const startEventsMonitoringAction = deviceContentCreator.async<MonitorEventsParameters, Message[]>(START_EVENTS_MONITORING);
export const stopEventsMonitoringAction = deviceContentCreator.async<void, void>(STOP_EVENTS_MONITORING);
export const clearMonitoringEventsAction = deviceContentCreator(CLEAR_MONITORING_EVENTS);
export const setDecoderInfoAction = deviceContentCreator.async<SetDecoderInfoParameters, DecoderState>(SET_DECODE_INFO);
export const removeDecoderInfoAction = deviceContentCreator(REMOVE_DECODE_INFO);
