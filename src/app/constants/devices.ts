/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
export const LIST_PLUG_AND_PLAY_DEVICES = `
    SELECT deviceId as DeviceId,
    status as Status,
    lastActivityTime as LastActivityTime,
    statusUpdatedTime as StatusUpdatedTime,
    authenticationType as AuthenticationType,
    cloudToDeviceMessageCount as CloudToDeviceMessageCount,
    connectionState as ConnectionState,
    capabilities.iotEdge as IotEdge
    FROM devices`;
export const DEVICE_TWIN_QUERY_STRING = ' SELECT * FROM devices WHERE deviceId = {deviceId}';

export const SAS_EXPIRES_MINUTES = 5;
export const CONNECTION_TIMEOUT_IN_SECONDS = 20;
export const RESPONSE_TIME_IN_SECONDS = 20;

export const DEVICE_LIST_WIDE_COLUMN_WIDTH = 350;
export const DEVICE_LIST_COLUMN_WIDTH = 150;
