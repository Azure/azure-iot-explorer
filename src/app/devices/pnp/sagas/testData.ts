/* tslint:disable */
export const interfaceId = 'dtmi:com:example:Thermostat;1';
export const modelDefinition = {
    "@id": "dtmi:com:example:Thermostat;1",
    "@type": "Interface",
    "contents": [
        {
            "@type": "Property",
            "name": "modelInformation",
            "displayName": "Model Information",
            "description": "Providing model and optional interfaces information on a digital twin.",
            "schema": {
                "@type": "Object",
                "fields": [
                    {
                        "name": "modelId",
                        "schema": "string"
                    },
                    {
                        "name": "interfaces",
                        "schema": {
                            "@type": "Map",
                            "mapKey": {
                                "name": "name",
                                "schema": "string"
                            },
                            "mapValue": {
                                "name": "schema",
                                "schema": "string"
                            }
                        }
                    }
                ]
            }
        }
    ],
    "@context": "https://azureiot.com/v1/contexts/Interface.json"
};

export const schemaId = 'dtmi:com:rido:inlineTests:inlineComp;2';
export const modelDefinitionWithInlineComp = {
    "@context": "dtmi:dtdl:context;2",
    "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
    "@type": "Interface",
    "contents": [
        {
        "@id": "dtmi:com:rido:inlineComp;2",
        "@type": "Component",
        "name": "inLineComponent",
        "schema": {
            "@type": "Interface",
            "@id": schemaId,
            "contents": [
            {
                "@type" : "Property",
                "name" : "inlineProp",
                "schema" : "string"
            }
            ]
        }
        }
    ]
    };
/* tslint:enable */