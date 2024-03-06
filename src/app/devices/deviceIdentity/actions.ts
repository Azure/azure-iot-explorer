/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { GET_DEVICE_IDENTITY, UPDATE_DEVICE_IDENTITY } from '../../constants/actionTypes';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { FetchDeviceParameters, UpdateDeviceParameters } from '../../api/parameters/deviceParameters';

const deviceContentCreator = actionCreatorFactory(DEVICECONTENT);
export const getDeviceIdentityAction = deviceContentCreator.async<FetchDeviceParameters, DeviceIdentity>(GET_DEVICE_IDENTITY);
export const updateDeviceIdentityAction = deviceContentCreator.async<UpdateDeviceParameters, DeviceIdentity>(UPDATE_DEVICE_IDENTITY);
