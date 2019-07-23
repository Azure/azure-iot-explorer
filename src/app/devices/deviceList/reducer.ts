/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { fromJS, Map } from 'immutable';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { deviceListStateInitial, DeviceListStateType } from './state';
import { listDevicesAction, clearDevicesAction, deleteDevicesAction, addDeviceAction, fetchInterfacesAction } from './actions';
import { DeviceSummary } from './../../api/models/deviceSummary';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import DeviceQuery from '../../api/models/deviceQuery';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';
import { BulkRegistryOperationResult } from '../../api/models/bulkRegistryOperationResult';
import { modelDiscoveryInterfaceName } from '../../constants/modelDefinitionConstants';

const reducer = reducerWithInitialState<DeviceListStateType>(deviceListStateInitial())
    .case(listDevicesAction.started, (state: DeviceListStateType, payload: DeviceQuery) => {
        return state.mergeIn(
            ['deviceQuery'],
            {...payload}
        ).setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.working
        );
    })
    .case(listDevicesAction.done, (state: DeviceListStateType, payload: {params: DeviceQuery} & {result: DeviceSummary[]}) => {
        return state.mergeIn(
            ['deviceQuery'],
            {...payload.params}
        ).setIn(
            ['devices', 'deviceList'],
            fromJS(payload.result)
        ).setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.fetched
        );
    })
    .case(listDevicesAction.failed, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.failed
        );
    })
    .case(addDeviceAction.started, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.working
        );
    })
    .case(addDeviceAction.done, (state: DeviceListStateType, payload: {params: DeviceIdentity} & {result: DeviceSummary}) => {
        let deviceList = state.devices.deviceList;
        deviceList = deviceList.unshift(fromJS(payload.result));
        return state.setIn(
            ['devices', 'deviceList'],
            deviceList
        ).setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.upserted
        );
    })
    .case(addDeviceAction.failed, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.failed
        );
    })
    .case(deleteDevicesAction.started, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.working
        );
    })
    .case(deleteDevicesAction.done, (state: DeviceListStateType, payload: {params: string[]} & {result: BulkRegistryOperationResult}) => {
        let deviceList = state.devices.deviceList;
        deviceList = deviceList.filter((device: Map<any, any>) => payload.params.indexOf(device.get('deviceId')) === -1); // tslint:disable-line
        return state.setIn(
            ['devices', 'deviceList'],
            deviceList
        ).setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.deleted
        );
    })
    .case(deleteDevicesAction.failed, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.failed
        );
    })
    .case(clearDevicesAction, (state: DeviceListStateType) => {
        return state.setIn(
            ['devices', 'deviceList'],
            fromJS([])
        ).setIn(
            ['devices', 'deviceListSynchronizationStatus'],
            SynchronizationStatus.deleted
        );
    })
    .case(fetchInterfacesAction.started, (state: DeviceListStateType, payload: string) => {
        const devices: DeviceSummary[] = state.devices.get('deviceList').toArray().map((item: Map<any, any>) => item.toJS() as DeviceSummary); // tslint:disable-line
        const index = devices.findIndex(device => {
            return device.deviceId === payload;
        });

        devices[index].deviceSummarySynchronizationStatus = SynchronizationStatus.working;

        return state.mergeIn(
            ['devices', 'deviceList', index],
            fromJS(devices[index])
        );
    })
    .case(fetchInterfacesAction.done, (state: DeviceListStateType, payload: {params: string} & {result: DigitalTwinInterfaces}) => {
        const devices: DeviceSummary[] = state.devices.get('deviceList').toArray().map((item: Map<any, any>) => item.toJS() as DeviceSummary); // tslint:disable-line
        const index = devices.findIndex(device => {
            return device.deviceId === payload.params;
        });

        let interfaceNames = null;
        // tslint:disable-next-line:cyclomatic-complexity
        if (
            payload &&
            payload.result &&
            payload.result.interfaces &&
            payload.result.interfaces[modelDiscoveryInterfaceName] &&
            payload.result.interfaces[modelDiscoveryInterfaceName].properties &&
            payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation &&
            payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported &&
            payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value &&
            payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value.interfaces) {
                interfaceNames = Object.keys(payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value.interfaces).map(
                    key => payload.result.interfaces[modelDiscoveryInterfaceName].properties.modelInformation.reported.value.interfaces[key]
                );
        }

        devices[index].deviceSummarySynchronizationStatus = SynchronizationStatus.fetched;
        const isPnp = interfaceNames && Object.keys(interfaceNames).length > 0;
        devices[index].isPnpDevice = isPnp;

        if (isPnp) {
            devices[index].interfaceIds = interfaceNames;
        }

        return state.mergeIn(
            ['devices', 'deviceList', index],
            fromJS(devices[index])
        );
    })
    .case(fetchInterfacesAction.failed, (state: DeviceListStateType, payload: {params: string}) => {
        const devices: DeviceSummary[] = state.devices.get('deviceList').toArray().map((item: Map<any, any>) => item.toJS() as DeviceSummary); // tslint:disable-line
        const index = devices.findIndex(device => {
            return device.deviceId === payload.params;
        });
        devices[index].deviceSummarySynchronizationStatus = SynchronizationStatus.failed;

        return state.updateIn(
            ['devices', 'deviceList'],
            () => fromJS(devices)
        );
    });
export default reducer;
