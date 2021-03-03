/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { Twin } from '../../api/models/device';

const deviceContentCreator = actionCreatorFactory(actionPrefixes.DEVICECONTENT);
export const getDeviceTwinAction = deviceContentCreator.async<string, Twin>(actionTypes.GET_TWIN);
export const updateDeviceTwinAction = deviceContentCreator.async<Twin, Twin>(actionTypes.UPDATE_TWIN);
