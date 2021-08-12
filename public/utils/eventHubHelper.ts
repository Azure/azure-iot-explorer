
/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { AmqpError, isAmqpError, Connection, ReceiverEvents, parseConnectionString } from "rhea-promise";
import * as crypto from "crypto";

// The following helper functions are directly copied from:
// https://raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/eventhub/event-hubs/samples/v5/typescript/src/iothubConnectionString.ts
export const convertIotHubToEventHubsConnectionString =  async (connectionString: string): Promise<string> =>
{
    const { HostName, SharedAccessKeyName, SharedAccessKey } = parseConnectionString<{
        HostName: string;
        SharedAccessKeyName: string;
        SharedAccessKey: string;
    }>(connectionString);
  
    // Verify that the required info is in the connection string.
    if (!HostName || !SharedAccessKey || !SharedAccessKeyName) {
        throw new Error(`Invalid IotHub connection string.`);
    }
  
    //Extract the IotHub name from the hostname.
    const [iotHubName] = HostName.split(".");
  
    if (!iotHubName) {
        throw new Error(`Unable to extract the IotHub name from the connection string.`);
    }
  
    // Generate a token to authenticate to the service.
    // The code for generateSasToken can be found at https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-security#security-tokens
    const token = generateSasToken(`${HostName}/messages/events`, SharedAccessKey, SharedAccessKeyName, 5);
  
    const connection = new Connection({
        transport: "tls",
        host: HostName,
        hostname: HostName,
        username: `${SharedAccessKeyName}@sas.root.${iotHubName}`,
        port: 5671,
        reconnect: false,
        password: token
    });
    await connection.open();
  
    // Create the receiver that will trigger a redirect error.
    const receiver = await connection.createReceiver({ source: { address: `amqps://${HostName}/messages/events/$management` }});
  
    return new Promise((resolve, reject) => {
        receiver.on(ReceiverEvents.receiverError, (context) => {
            const error = context.receiver && context.receiver.error;
            if (isAmqpError(error) && (error as AmqpError).condition === "amqp:link:redirect") {
                const hostname = (error as AmqpError).info?.hostname;
                if (!hostname) {
                    reject(error);
                } else {
                    resolve(`Endpoint=sb://${hostname}/;EntityPath=${iotHubName};SharedAccessKeyName=${SharedAccessKeyName};SharedAccessKey=${SharedAccessKey}`);
                }
            } else {
                reject(error);
            }
            connection.close().catch(() => {
            /* ignore error */
            });
        });
    });
}

// This code copied from event hub's sample
// https://raw.githubusercontent.com/Azure/azure-sdk-for-js/main/sdk/eventhub/event-hubs/samples/v5/typescript/src/iothubConnectionString.ts
const generateSasToken = (resourceUri: string, signingKey: string, policyName: string, expiresInMins: number): string => {
    resourceUri = encodeURIComponent(resourceUri);
    const expiresInSeconds = Math.ceil(Date.now() / 1000 + expiresInMins * 60);
    const toSign = resourceUri + "\n" + expiresInSeconds;
  
    // Use the crypto module to create the hmac.
    const hmac = crypto.createHmac("sha256", Buffer.from(signingKey, "base64"));
    hmac.update(toSign);
    const base64UriEncoded = encodeURIComponent(hmac.digest("base64"));
  
    // Construct authorization string.
    return `SharedAccessSignature sr=${resourceUri}&sig=${base64UriEncoded}&se=${expiresInSeconds}&skn=${policyName}`;
}