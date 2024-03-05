/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';
import { DataPlaneResponse, Device } from '../../api/models/device';
import { DeleteDevicesParameters, FetchDevicesParameters } from '../../api/parameters/deviceParameters';

const deviceListCreator = actionCreatorFactory(actionPrefixes.DEVICELISTS);
const listDevicesAction = deviceListCreator.async<FetchDevicesParameters, DataPlaneResponse<Device[]>>(actionTypes.LIST_DEVICES);
const deleteDevicesAction = deviceListCreator.async<DeleteDevicesParameters, BulkRegistryOperationResult>(actionTypes.DELETE_DEVICES);

export {
    deleteDevicesAction,
    listDevicesAction
};
