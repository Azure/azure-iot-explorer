/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { DeviceContentStateType, deviceContentStateInitial } from './state';
import {
    clearModelDefinitionsAction,
    getDeviceIdentityAction,
    getDigitalTwinInterfacePropertiesAction,
    getTwinAction,
    invokeDeviceMethodAction,
    getModelDefinitionAction,
    setInterfaceIdAction,
    updateTwinAction,
    UpdateTwinActionParameters,
    updateDeviceIdentityAction,
    patchDigitalTwinInterfacePropertiesAction,
    PatchDigitalTwinInterfacePropertiesActionParameters,
    ModelDefinitionActionResult,
    GetModelDefinitionActionParameters
} from './actions';
import { Twin } from '../../api/models/device';
import { DeviceIdentity } from '../../api/models/deviceIdentity';
import { SynchronizationStatus } from '../../api/models/synchronizationStatus';
import { InvokeMethodParameters } from '../../api/parameters/deviceParameters';
import { DigitalTwinInterfaces } from '../../api/models/digitalTwinModels';

const reducer = reducerWithInitialState<DeviceContentStateType>(deviceContentStateInitial())
    //#region DeviceIdentity-related actions
    .case(getDeviceIdentityAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentitySynchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDeviceIdentityAction.done, (state: DeviceContentStateType, payload: {params: string} & {result: DeviceIdentity}) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentity: payload.result,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDeviceIdentityAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentitySynchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateDeviceIdentityAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentity: state.deviceIdentity.deviceIdentity,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateDeviceIdentityAction.done, (state: DeviceContentStateType, payload: {params: DeviceIdentity} & {result: DeviceIdentity}) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentity: payload.result,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateDeviceIdentityAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceIdentity: {
                deviceIdentity: state.deviceIdentity.deviceIdentity,
                deviceIdentitySynchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    //#endregion
    //#region DeviceTwin-related actions
    .case(getTwinAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceTwin: {
                deviceTwinSynchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getTwinAction.done, (state: DeviceContentStateType, payload: {params: string} & {result: Twin}) => {
        return state.merge({
            deviceTwin: {
                deviceTwin: payload.result,
                deviceTwinSynchronizationStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getTwinAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceTwin: {
                deviceTwinSynchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(updateTwinAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            deviceTwin: {
                deviceTwin: state.deviceTwin.deviceTwin,
                deviceTwinSynchronizationStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(updateTwinAction.done, (state: DeviceContentStateType, payload: {params: UpdateTwinActionParameters} & {result: Twin}) => {
        return state.merge({
            deviceTwin: {
                deviceTwin: payload.result,
                deviceTwinSynchronizationStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(updateTwinAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            deviceTwin: {
                deviceTwin: state.deviceTwin.deviceTwin,
                deviceTwinSynchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    //#endregion
    //#region Interface-related actions
    .case(getModelDefinitionAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                modelDefinitionSynchronizationStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getModelDefinitionAction.done, (state: DeviceContentStateType, payload: {params: GetModelDefinitionActionParameters} & {result: ModelDefinitionActionResult}) => {
        return state.merge({
            modelDefinitionWithSource: {
                modelDefinition: payload.result.modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: payload.result.source
            }
        });
    })
    .case(getModelDefinitionAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: {
                modelDefinition: null,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(clearModelDefinitionsAction, (state: DeviceContentStateType) => {
        return state.merge({
            modelDefinitionWithSource: null
        });
    })
    .case(setInterfaceIdAction, (state: DeviceContentStateType, payload: string) => {
        return state.merge({
            interfaceIdSelected: payload
        });
    })
    //#endregion
    //#region DigitalTwin-related actions
    .case(getDigitalTwinInterfacePropertiesAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.working
            }
        });
    })
    .case(getDigitalTwinInterfacePropertiesAction.done, (state: DeviceContentStateType, payload: {params: string} & {result: DigitalTwinInterfaces}) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfaceProperties: payload.result,
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.fetched
            }
        });
    })
    .case(getDigitalTwinInterfacePropertiesAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.failed
            }
        });
    })
    .case(patchDigitalTwinInterfacePropertiesAction.started, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfaceProperties: state.digitalTwinInterfaceProperties.digitalTwinInterfaceProperties,
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.updating
            }
        });
    })
    .case(patchDigitalTwinInterfacePropertiesAction.done, (state: DeviceContentStateType, payload: {params: PatchDigitalTwinInterfacePropertiesActionParameters} & {result: DigitalTwinInterfaces}) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfaceProperties: payload.result,
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.upserted
            }
        });
    })
    .case(patchDigitalTwinInterfacePropertiesAction.failed, (state: DeviceContentStateType) => {
        return state.merge({
            digitalTwinInterfaceProperties: {
                digitalTwinInterfaceProperties: state.digitalTwinInterfaceProperties.digitalTwinInterfaceProperties,
                digitalTwinInterfacePropertiesSyncStatus: SynchronizationStatus.failed
            }
        });
    })
    //#endregion
    .case(invokeDeviceMethodAction.done, (state: DeviceContentStateType, payload: {params: InvokeMethodParameters} & {result: string}) => {
        return state.deviceIdentity.deviceIdentity.deviceId === payload.params.deviceId ? state.merge({invokeMethodResponse: payload.result}) : state;
    })
    .case(invokeDeviceMethodAction.failed, (state: DeviceContentStateType, payload: {params: InvokeMethodParameters} & {error: Error}) => { // tslint:disable-line
        return state.deviceIdentity.deviceIdentity.deviceId === payload.params.deviceId ? state.merge({invokeMethodResponse: payload.error.message}) : state;
    });
export default reducer;
