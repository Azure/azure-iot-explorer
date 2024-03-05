/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';
import { DeviceQuery } from '../../api/models/deviceQuery';
import { DataPlaneResponse, Device } from '../../api/models/device';

export interface ListDevicesActionParams {
    query: DeviceQuery;
    connectionString: string;
}

const deviceListCreator = actionCreatorFactory(actionPrefixes.DEVICELISTS);
const listDevicesAction = deviceListCreator.async<ListDevicesActionParams, DataPlaneResponse<Device[]>>(actionTypes.LIST_DEVICES);
const deleteDevicesAction = deviceListCreator.async<string[], BulkRegistryOperationResult>(actionTypes.DELETE_DEVICES);

export {
    deleteDevicesAction,
    listDevicesAction
};
