
/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import { Record } from 'immutable';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { getDeviceSettingTupleSelector } from './selectors';
import { getInitialState } from '../../../../api/shared/testHelper';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

describe('getDigitalTwinInterfacePropertiesSelector', () => {
    const state = getInitialState();
    const interfaceId = 'urn:contoso:com:EnvironmentalSensor:1';
    const componentName = 'environmentalSensor';
    /* tslint:disable */
    const digitalTwinInterfaceProperties = {
        interfaces: {
            urn_azureiot_ModelDiscovery_DigitalTwin: {
                name: 'urn_azureiot_ModelDiscovery_DigitalTwin',
                properties: {
                    modelInformation: {
                        reported: {
                            value: {
                                modelId: 'urn:azureiot:testdevicecapabilitymodel:1',
                                interfaces: {
                                    environmentalSensor: interfaceId,
                                    urn_azureiot_ModelDiscovery_DigitalTwin: 'urn:azureiot:ModelDiscovery:DigitalTwin:1'
                                }
                            }
                        }
                    }
                }
            },
            environmentalSensor: {
                name: componentName,
                properties: {
                    brightness: {
                        desired: {
                            value: 123
                        },
                        reported: {
                            desiredState: {
                              code: 200,
                              description: 'Brightness updated',
                              version: 19
                            },
                            value: 123
                        }
                    }
                }
            }
        }
    };

    const modelDefinition: ModelDefinition = {
        '@id': interfaceId,
        '@type': 'Interface',
        '@context': 'http://azureiot.com/v1/contexts/Interface.json',
        displayName: 'Environmental Sensor',
        description: 'Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties',
        comment: 'Requires temperature and humidity sensors.',
        contents: [
            {
                '@type': 'Property',
                displayName: 'Brightness Level',
                description: 'The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)',
                name: 'brightness',
                writable: true,
                schema: 'long'
            }
        ]
    }
    /* tslint:enable */

    state.deviceContentState = Record({
        componentNameSelected: componentName,
        deviceIdentity: null,
        deviceTwin: null,
        digitalTwinInterfaceProperties: {
            payload: digitalTwinInterfaceProperties,
            synchronizationStatus: SynchronizationStatus.fetched
        },
        modelDefinitionWithSource: {
            payload: {
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Private
            },
            synchronizationStatus: SynchronizationStatus.fetched,
        }
    })();

    it('returns interface settings tuple', () => {
        expect(getDeviceSettingTupleSelector(state).interfaceId).toEqual(interfaceId);
        expect(getDeviceSettingTupleSelector(state).componentName).toEqual(componentName);

        expect(getDeviceSettingTupleSelector(state).twinWithSchema[0]).toEqual({
            desiredTwin: digitalTwinInterfaceProperties.interfaces.environmentalSensor.properties.brightness.desired.value,
            reportedTwin: digitalTwinInterfaceProperties.interfaces.environmentalSensor.properties.brightness.reported,
            settingModelDefinition: modelDefinition.contents[0],
            settingSchema: {
                description: `${modelDefinition.contents[0].displayName} / ${modelDefinition.contents[0].description}`,
                title: modelDefinition.contents[0].name,
                type: 'number'
            }
        });
    });
});
