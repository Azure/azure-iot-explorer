/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { Type } from 'protobufjs';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { CLEAR_MONITORING_EVENTS, SET_DECODE_FILE, SET_DECODE_INFO, SET_DECODE_TYPE, START_EVENTS_MONITORING, STOP_EVENTS_MONITORING, VALIDATE_DECODE_INFO } from '../../constants/actionTypes';
import { Message } from '../../api/models/messages';
import { MonitorEventsParameters, SetDecoderInfoParameters, ValidateDecoderInfoParameters } from '../../api/parameters/deviceParameters';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
export const startEventsMonitoringAction = deviceContentCreator.async<MonitorEventsParameters, Message[]>(START_EVENTS_MONITORING);
export const stopEventsMonitoringAction = deviceContentCreator.async<void, void>(STOP_EVENTS_MONITORING);
export const clearMonitoringEventsAction = deviceContentCreator(CLEAR_MONITORING_EVENTS);
export const setDecoderProtoFileAction = deviceContentCreator<File>(SET_DECODE_FILE);
export const setDecoderPrototypeAction = deviceContentCreator<Type | undefined>(SET_DECODE_TYPE);
export const setDecoderInfoAction = deviceContentCreator<SetDecoderInfoParameters>(SET_DECODE_INFO);
export const validateDecoderInfoAction = deviceContentCreator<ValidateDecoderInfoParameters>(VALIDATE_DECODE_INFO);
