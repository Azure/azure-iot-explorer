/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export declare enum AccessRights {
    RegistryRead = 'RegistryRead',
    RegistryWrite = 'RegistryWrite',
    ServiceConnect = 'ServiceConnect',
    DeviceConnect = 'DeviceConnect',
    RegistryReadRegistryWrite = 'RegistryRead, RegistryWrite',
    RegistryReadServiceConnect = 'RegistryRead, ServiceConnect',
    RegistryReadDeviceConnect = 'RegistryRead, DeviceConnect',
    RegistryWriteServiceConnect = 'RegistryWrite, ServiceConnect',
    RegistryWriteDeviceConnect = 'RegistryWrite, DeviceConnect',
    ServiceConnectDeviceConnect = 'ServiceConnect, DeviceConnect',
    RegistryReadRegistryWriteServiceConnect = 'RegistryRead, RegistryWrite, ServiceConnect',
    RegistryReadRegistryWriteDeviceConnect = 'RegistryRead, RegistryWrite, DeviceConnect',
    RegistryReadServiceConnectDeviceConnect = 'RegistryRead, ServiceConnect, DeviceConnect',
    RegistryWriteServiceConnectDeviceConnect = 'RegistryWrite, ServiceConnect, DeviceConnect',
    RegistryReadRegistryWriteServiceConnectDeviceConnect = 'RegistryRead, RegistryWrite, ServiceConnect, DeviceConnect',
}
