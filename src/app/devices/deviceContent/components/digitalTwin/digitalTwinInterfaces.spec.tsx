/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { mountWithStoreAndRouter } from '../../../../shared/utils/testHelpers';
import { DigitalTwinInterfaces } from './digitalTwinInterfaces';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import MultiLineShimmer from '../../../../shared/components/multiLineShimmer';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

describe('login/components/connectivityPane', () => {
    const routerProps: any = { // tslint:disable-line:no-any
        history: {
            location,
            push: jest.fn()
        },
        location,
        match: {
            url: 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice'
        }
    };

     /* tslint:disable */
    const modelDefinition ={
        "@id": "dtmi:plugnplay:hube2e:cm;1",
        "@type": "Interface",
        "displayName": "IoT Hub E2E Tests",
            "contents": [
                {
                    "@type": "Component",
                    "name": "deviceInformation",
                    "schema": "dtmi:__DeviceManagement:DeviceInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "sdkInfo",
                    "schema": "dtmi:__Client:SDKInformation;1"
                },
                {
                    "@type": "Component",
                    "name": "environmentalSensor",
                    "schema": "dtmi:__Contoso:EnvironmentalSensor;1"
                }
            ],
            "@context": "dtmi:dtdl:context;2"
        };
    /* tslint:enable */

    const digitalTwinInterfacesDataProps =
    {
        componentNameToIds: [],
        isDigitalTwinLoading: true,
        isModelDefinitionLoading: false,
        modelDefinitionWithSource: null,
        modelId: ''
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...digitalTwinInterfacesDataProps,
            ...routerProps,
            ...overrides
        };

        return (
            <DigitalTwinInterfaces {...props} />
        );
    };

    it('shows shimmer when model id is not retrieved', () => {
        const digitalTwinInterfaces = mountWithStoreAndRouter(getComponent(), true, true).find(DigitalTwinInterfaces);
        expect(digitalTwinInterfaces.find(MultiLineShimmer)).toHaveLength(1);
    });

    it('shows model id with no model definition found', () => {
        const digitalTwinInterfaces = mountWithStoreAndRouter(
            getComponent({
                isDigitalTwinLoading: false,
                modelId: 'dtmi:__azureiot:sampleModel;1',
            }),
            true,
            true).find(DigitalTwinInterfaces);

        const labels = digitalTwinInterfaces.find(Label);
        expect(labels).toHaveLength(1);
        expect(labels.first().props().children).toEqual(ResourceKeys.digitalTwin.modelId);

        const h4 = digitalTwinInterfaces.find('h4');
        expect(h4).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(h4.at(1).props().children).toEqual(ResourceKeys.digitalTwin.steps.secondFailure);
    });

    it('shows model id with null model definition found', () => {
        const digitalTwinInterfaces = mountWithStoreAndRouter(
            getComponent({
                isDigitalTwinLoading: false,
                modelDefinitionWithSource: {
                    isModelValid: false,
                    modelDefinition: null,
                    source: REPOSITORY_LOCATION_TYPE.Local,
                },
                modelId: 'dtmi:__azureiot:sampleModel;1'
            }),
            true,
            true).find(DigitalTwinInterfaces);

        const h4 = digitalTwinInterfaces.find('h4');
        expect(h4).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(h4.at(1).props().children).toEqual(ResourceKeys.digitalTwin.steps.secondSuccess);

        const labels = digitalTwinInterfaces.find(Label);
        expect(labels).toHaveLength(2); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label]);

        const messageBar = digitalTwinInterfaces.find(MessageBar);
        expect(messageBar).toHaveLength(1);
        expect(messageBar.first().props().children).toEqual(ResourceKeys.deviceInterfaces.interfaceNotValid);
    });

    it('shows model id with valid model definition found but has no component from selector', () => {
        const digitalTwinInterfaces = mountWithStoreAndRouter(
            getComponent({
                isDigitalTwinLoading: false,
                modelDefinitionWithSource: {
                    isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Public,
                },
                modelId: 'dtmi:__azureiot:sampleModel;1'
            }),
            true,
            true).find(DigitalTwinInterfaces);

        const h4 = digitalTwinInterfaces.find('h4');
        expect(h4).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(h4.at(2).props().children).toEqual(ResourceKeys.digitalTwin.steps.third); // tslint:disable-line:no-magic-numbers

        const labels = digitalTwinInterfaces.find(Label);
        expect(labels).toHaveLength(3); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.settings.modelDefinitions.repositoryTypes.public.label]);

        expect(digitalTwinInterfaces.find(Announced)).toHaveLength(1);
        expect(digitalTwinInterfaces.find(Pivot)).toHaveLength(1);
    });

    it('shows model id with valid model definition found and has components', () => {
        const digitalTwinInterfaces = mountWithStoreAndRouter(
            getComponent({
                componentNameToIds: [
                    {componentName: 'deviceInformation', interfaceId: 'dtmi:__DeviceManagement:DeviceInformation;1'},
                    {componentName: 'sdkInfo', interfaceId: 'dtmi:__Client:SDKInformation;1'},
                    {componentName: 'environmentalSensor', interfaceId: 'dtmi:__Contoso:EnvironmentalSensor;1'}],
                isDigitalTwinLoading: false,
                modelDefinitionWithSource: {
                    isModelValid: true,
                    modelDefinition,
                    source: REPOSITORY_LOCATION_TYPE.Local,
                },
                modelId: 'dtmi:__azureiot:sampleModel;1'
            }),
            true,
            true).find(DigitalTwinInterfaces);

        expect(digitalTwinInterfaces.find(Announced)).toHaveLength(0);

        const labels = digitalTwinInterfaces.find(Label);
        expect(labels).toHaveLength(5); // tslint:disable-line:no-magic-numbers
        expect(labels.at(1).props().children).toEqual([ResourceKeys.deviceInterfaces.columns.source, ': ', ResourceKeys.settings.modelDefinitions.repositoryTypes.local.label]);
        expect(labels.at(2).props().children).toEqual('dtmi:__DeviceManagement:DeviceInformation;1'); // tslint:disable-line:no-magic-numbers
        expect(labels.at(3).props().children).toEqual('dtmi:__Client:SDKInformation;1'); // tslint:disable-line:no-magic-numbers
        expect(labels.at(4).props().children).toEqual('dtmi:__Contoso:EnvironmentalSensor;1'); // tslint:disable-line:no-magic-numbers
    });
});
