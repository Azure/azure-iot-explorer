/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import actionCreatorFactory from 'typescript-fsa';
import * as actionPrefixes from '../../constants/actionPrefixes';
import * as actionTypes from '../../constants/actionTypes';
import { DeviceSummary } from '../../api/models/deviceSummary';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import DeviceQuery from '../../api/models/deviceQuery';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';

const deviceListCreator = actionCreatorFactory(actionPrefixes.DEVICELISTS);
const clearDevicesAction = deviceListCreator<void>(actionTypes.CLEAR_DEVICES);
const listDevicesAction = deviceListCreator.async<DeviceQuery, DeviceSummary[]>(actionTypes.LIST_DEVICES);
const deleteDevicesAction = deviceListCreator.async<string[], BulkRegistryOperationResult>(actionTypes.DELETE_DEVICES);
const addDeviceAction = deviceListCreator.async<DeviceIdentity, DeviceSummary>(actionTypes.ADD_DEVICE);

const setIsPnpAction = deviceListCreator.async<string, boolean>(actionTypes.SET_ISPNP);
const fetchInterfacesAction = deviceListCreator.async<string, DigitalTwinInterfaces>(actionTypes.FETCH_INTERFACES);

export {
    addDeviceAction,
    clearDevicesAction,
    deleteDevicesAction,
    listDevicesAction,
    setIsPnpAction,
    fetchInterfacesAction
};
