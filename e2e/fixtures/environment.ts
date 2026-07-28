export interface E2EConfiguration {
    hubName: string;
    subscriptionId: string;
}

export interface E2EEnvironment {
    connectionString: string;
    hubHostName: string;
    hubName: string;
    subscriptionId: string;
}

const parseConnectionString = (connectionString: string): Map<string, string> => {
    const values = new Map<string, string>();

    for (const segment of connectionString.split(';')) {
        const separatorIndex = segment.indexOf('=');
        if (separatorIndex > 0) {
            values.set(segment.slice(0, separatorIndex).trim(), segment.slice(separatorIndex + 1).trim());
        }
    }

    return values;
};

export const loadE2EConfiguration = (): E2EConfiguration => {
    const subscriptionId = process.env.E2E_AZURE_SUBSCRIPTION_ID?.trim();
    if (!subscriptionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(subscriptionId)) {
        throw new Error('E2E_AZURE_SUBSCRIPTION_ID must contain the Azure subscription ID for the test hub.');
    }

    const hubName = process.env.E2E_IOTHUB_NAME?.trim().toLowerCase();
    if (!hubName || !/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?$/.test(hubName)) {
        throw new Error('E2E_IOTHUB_NAME must contain a valid Azure IoT Hub name.');
    }

    return {
        hubName,
        subscriptionId,
    };
};

export const createE2EEnvironment = (
    configuration: E2EConfiguration,
    connectionString: string
): E2EEnvironment => {
    const values = parseConnectionString(connectionString);
    const hubHostName = values.get('HostName');
    if (!hubHostName) {
        throw new Error('The Azure CLI IoT Hub connection string is missing HostName.');
    }

    const normalizedHostName = hubHostName.toLowerCase();
    if (!/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])?(?:\.privatelink)?\.azure-devices\.(?:net|cn|us)$/.test(normalizedHostName)) {
        throw new Error('The Azure CLI returned an invalid Azure IoT Hub hostname.');
    }

    const hubName = normalizedHostName.split('.')[0];
    if (hubName !== configuration.hubName) {
        throw new Error(`The Azure CLI returned credentials for ${hubName}, not the requested IoT Hub ${configuration.hubName}.`);
    }

    return {
        connectionString,
        hubHostName: normalizedHostName,
        hubName,
        subscriptionId: configuration.subscriptionId,
    };
};

export const redactSecrets = (
    value: string,
    environment?: Pick<E2EEnvironment, 'connectionString'>
): string => {
    const redactedValue = environment?.connectionString
        ? value.replaceAll(environment.connectionString, '[REDACTED_IOTHUB_CONNECTION_STRING]')
        : value;
    return redactedValue.replace(/SharedAccessKey=[^;\s]+/gi, 'SharedAccessKey=[REDACTED]');
};
