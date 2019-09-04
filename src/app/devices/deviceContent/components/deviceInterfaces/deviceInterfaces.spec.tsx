/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import DeviceInterfaces, { DeviceInterfaceProps, DeviceInterfaceDispatchProps } from './deviceInterfaces';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { testWithLocalizationContext } from '../../../../shared/utils/testHelpers';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

describe('components/devices/deviceInterfaces', () => {

    const getRouterProps = (pathname?: string, search?: string) => {
        const location: any = { // tslint:disable-line:no-any
            pathname,
            search
        };
        const routerProps: any = { // tslint:disable-line:no-any
            history: {
                location,
            },
            location,
            match: {
                params: {}
            }
        };
        return routerProps;
    };

    const dataProps: DeviceInterfaceProps = {
        isLoading: true,
        modelDefinitionWithSource: {modelDefinitionSynchronizationStatus: SynchronizationStatus.working},
    };

    const settingsVisibleToggle = jest.fn();
    const refresh = jest.fn();
    const dispatchProps: DeviceInterfaceDispatchProps = {
        refresh,
        setInterfaceId: jest.fn(),
        settingsVisibleToggle
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...dataProps,
            ...dispatchProps,
            ...getRouterProps(),
            ...overrides,
        };
        return testWithLocalizationContext(<DeviceInterfaces {...props} />);
    };

    /* tslint:disable */
    const modelDefinition = {
        "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
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
        "@context": "http://azureiot.com/v1/contexts/Interface.json"
    };
    /* tslint:enable */

    it('show Shimmer when status is working', () => {
        const wrapper = getComponent();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Shimmer)).toHaveLength(1);
    });

    it('show interface information when status is failed', () => {
        const wrapper = getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                modelDefinitionSynchronizationStatus: SynchronizationStatus.failed
            }
        });
        expect(wrapper).toMatchSnapshot();
    });

    it('show interface information when status is fetched', () => {
        let wrapper = getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: REPOSITORY_LOCATION_TYPE.Public
            }
        });
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(DefaultButton).props().onClick(null));
        expect(settingsVisibleToggle).toBeCalled();
        const command = wrapper.find(CommandBar);
        command.props().items[0].onClick(null);
        expect(refresh).toBeCalled();

        wrapper = getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: REPOSITORY_LOCATION_TYPE.Private
            }
        });
        expect(wrapper).toMatchSnapshot();

        wrapper = getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: REPOSITORY_LOCATION_TYPE.Device
            }
        });
        expect(wrapper).toMatchSnapshot();

        wrapper = getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                modelDefinition,
                modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched,
                source: undefined
            }
        });
        expect(wrapper).toMatchSnapshot();
    });
});
