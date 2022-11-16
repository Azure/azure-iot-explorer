/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { CLEAR_MONITORING_EVENTS, SET_DEFAULT_DECODE_INFO, SET_DECODE_INFO, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING, SET_EVENTS_MESSAGES } from '../../constants/actionTypes';
import { Message } from '../../api/models/messages';
import { MonitorEventsParameters, SetDecoderInfoParameters } from '../../api/parameters/deviceParameters';
import { ContentTypeState } from './state';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
export const startEventsMonitoringAction = deviceContentCreator.async<MonitorEventsParameters, void>(START_EVENTS_MONITORING);
export const stopEventsMonitoringAction = deviceContentCreator.async<void, void>(STOP_EVENTS_MONITORING);
export const clearMonitoringEventsAction = deviceContentCreator(CLEAR_MONITORING_EVENTS);
export const setDecoderInfoAction = deviceContentCreator.async<SetDecoderInfoParameters, ContentTypeState>(SET_DECODE_INFO);
export const setDefaultDecodeInfoAction = deviceContentCreator(SET_DEFAULT_DECODE_INFO);
export const setEventsMessagesAction = deviceContentCreator.async<Message[], Message[]>(SET_EVENTS_MESSAGES);
