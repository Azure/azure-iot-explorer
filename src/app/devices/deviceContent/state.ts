/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Record } from 'immutable';
import { IM } from '../../shared/types/types';
import { ModelDefinitionWithSourceWrapper } from '../../api/models/modelDefinitionWithSourceWrapper';
import { DeviceIdentityWrapper } from '../../api/models/deviceIdentityWrapper';
import { DeviceTwinWrapper } from './../../api/models/deviceTwinWrapper';
import { DigitalTwinInterfacePropertiesWrapper } from '../../api/models/digitalTwinInterfacePropertiesWrapper';
import { ModuleIdentityListWrapper } from './../../api/models/moduleIdentityListWrapper';

export interface DeviceContentStateInterface {
    deviceIdentity: DeviceIdentityWrapper;
    deviceTwin: DeviceTwinWrapper;
    digitalTwinInterfaceProperties: DigitalTwinInterfacePropertiesWrapper;
    interfaceIdSelected: string;
    modelDefinitionWithSource: ModelDefinitionWithSourceWrapper;
    moduleIdentityList: ModuleIdentityListWrapper;
}

export const deviceContentStateInitial = Record<DeviceContentStateInterface>({
    deviceIdentity: null,
    deviceTwin: null,
    digitalTwinInterfaceProperties: null,
    interfaceIdSelected: '',
    modelDefinitionWithSource: null,
    moduleIdentityList: null
});

export type DeviceContentStateType = IM<DeviceContentStateInterface>;
