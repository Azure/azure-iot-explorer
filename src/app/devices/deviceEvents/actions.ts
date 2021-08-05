/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { CLEAR_MONITORING_EVENTS, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING } from '../../constants/actionTypes';
import { Message } from '../../api/models/messages';
import { MonitorEventsParameters } from '../../api/parameters/deviceParameters';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
export const startEventsMonitoringAction = deviceContentCreator.async<MonitorEventsParameters, Message[]>(START_EVENTS_MONITORING);
export const stopEventsMonitoringAction = deviceContentCreator(STOP_EVENTS_MONITORING);
export const clearMonitoringEventsAction = deviceContentCreator(CLEAR_MONITORING_EVENTS);
