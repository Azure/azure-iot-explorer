/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/

export interface DataPlaneRequest {
    apiVersion: string;
    body?: string;
    headers?: Record<string, unknown>;
    hostName: string;
    httpMethod: string;
    path: string;
    sharedAccessSignature: string;
    queryString?: string;
}

export interface DataPlaneResponse {
    body: {
        body: any; // tslint:disable-line:no-any
        headers?: any; // tslint:disable-line:no-any
        Message?: string;
    };
    statusCode: number;
    statusText: string;
}

export interface ReadFileRequest {
    path: string;
    file: string;
}

export interface GetDirectoriesRequest {
    path: string;
}

export interface StartEventHubMonitoringRequest {
    deviceId: string;
    moduleId?: string;
    consumerGroup: string;
    customEventHubConnectionString?: string;
    hubConnectionString?: string;
}

export interface Message {
    body: any; // tslint:disable-line:no-any
    enqueuedTime: string;
    sequenceNumber?: number;
    properties?: any; // tslint:disable-line:no-any
    systemProperties?: {[key: string]: string};
}

export interface MessageProperty {
    key: string;
    isSystemProperty: boolean;
    value: string;
}

export interface SendMessageToDeviceParameters {
    connectionString: string;
    deviceId: string;
    messageBody: string;
    messageProperties?: MessageProperty[];
}

export interface DeviceInterface {
    /**
     * Make a data plane request to Azure IoT Hub
     */
    dataPlaneRequest(request: DataPlaneRequest): Promise<DataPlaneResponse>;

    /**
     * Read a local file from the model repository
     */
    readLocalFile(request: ReadFileRequest): Promise<string | null>;

    /**
     * Read a local file without matching @id
     */
    readLocalFileNaive(request: ReadFileRequest): Promise<string>;

    /**
     * Get directories from a path
     */
    getDirectories(request: GetDirectoriesRequest): Promise<string[]>;

    /**
     * Start EventHub monitoring for device messages
     */
    startEventHubMonitoring(request: StartEventHubMonitoringRequest): Promise<void>;

    /**
     * Stop EventHub monitoring
     */
    stopEventHubMonitoring(): Promise<void>;

    /**
     * Subscribe to EventHub messages
     * Returns an unsubscribe function
     */
    onEventHubMessage(callback: (messages: Message[]) => void): () => void;

    /**
     * Send a message to a device (legacy)
     */
    sendMessageToDevice(params: SendMessageToDeviceParameters): Promise<void>;
}
