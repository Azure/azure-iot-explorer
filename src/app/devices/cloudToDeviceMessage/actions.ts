/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import { DEVICECONTENT } from '../../constants/actionPrefixes';
import { CLOUD_TO_DEVICE_MESSAGE } from '../../constants/actionTypes';
import { CloudToDeviceMessageParameters } from '../../api/parameters/deviceParameters';

export const cloudToDeviceMessageAction = actionCreatorFactory(DEVICECONTENT).async<CloudToDeviceMessageParameters, string>(CLOUD_TO_DEVICE_MESSAGE);

