/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
// tslint:disable
export const stringTypeWritableProperty = {
    "@type": "Property",
    "name": "property0",
    "writable": true,
    "schema": "string"
};


export const longTypeNonWritableProperty = {
    "@type": "Property",
    "name": "property1",
    "schema": "long"
};

export const longTypeNonWritableProperty2 = {
    "@type": "Property",
    "name": "property1",
    "writable": false,
    "schema": "long"
};

export const enumbTypeProperty = {
    "@type": [
        "Property",
        "SemanticType/Humidity"
    ],
    "name": "state",
    "displayName": "State",
    "schema": {
        "@type": "Enum",
        "valueSchema": "string",
        "enumValues": [
            {
                "displayName": "Offline",
                "name": "offline",
                "enumValue": "1"
            },
            {
                "displayName": "Online",
                "name": "online",
                "enumValue": "2"
            }
        ]
    },
    "writable": true
};

export const timeTypeCommand = {
    "@type": "Command",
    "name": "command",
    "request": {
        "name": "name0",
        "schema": "datetime"
    },
    "response": {
        "name": "name1",
        "schema": "duration"
    }
};

export const commandWithReusableSchemaInline = {
    "@type": [
        "Command",
        "SemanticType/Humidity"
    ],
    "name": "reboot2",
    "commandType": "asynchronous",
    "request": {
        "name": "commandWithReusableSchema",
        "schema": {
            "@type": "Object",
            "fields": [
                {
                    "name": "sensor",
                    "schema": "dtmi:example:schema;1"
                }
            ]
        }
    }
};

export const commandWithReusableSchemaNotInline = {
    "@type": [
        "Command",
        "SemanticType/Humidity"
    ],
    "name": "reboot2",
    "commandType": "asynchronous",
    "request": {
        "name": "commandWithReusableSchema",
        "schema": {
            "@type": "Object",
            "fields": [
                {
                    "name": "sensor",
                    "schema": "dtmi:example:schema;2"
                }
            ]
        }
    }
};

export const mapTypeTelemetry = {
    "@type": "Telemetry",
    "name": "telemetry",
    "schema": {
        "@type": "Map",
        "mapKey": {
            "name": "telemetryName",
            "schema": "string"
        },
        "mapValue": {
            "name": "telemetryConfig",
            "schema": "date"
        }
    }
};

export const schema = [
    {
        "@id": "dtmi:example:schema;1",
        "@type": "Object",
        "fields": [
            {
                "name": "sensor0",
                "schema": "time"
            },
            {
                "name": "sensor1",
                "schema": "integer"
            },
            {
                "name": "sensor2",
                "schema": "boolean"
            }
        ]
    }
];

export const mockModelDefinition = {
    "@id": "dtmi:contoso:com:EnvironmentalSensor;1",
    "@type": "Interface",
    "contents": [
        {
            ...stringTypeWritableProperty
        },
        {
            ...longTypeNonWritableProperty
        },
        {
            ...longTypeNonWritableProperty2
        },
        {
            ...timeTypeCommand
        },
        {
            ...mapTypeTelemetry
        }
    ],
    "@context": "dtmi:dtdl:context;2"
};
// tslint:enable
