/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Shimmer } from 'office-ui-fabric-react';
import DeviceInterfaces, { DeviceInterfaceProps, DeviceInterfaceDispatchProps } from './deviceInterfaces';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { LocalizationContextProvider } from '../../../../shared/contexts/localizationContext';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';

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
        modelDefinitionWithSource: {modelDefinitionSynchronizationStatus: SynchronizationStatus.working, source: REPOSITORY_LOCATION_TYPE.None},
    };

    const dispatchProps: DeviceInterfaceDispatchProps = {
        refresh: jest.fn(),
        setInterfaceId: jest.fn(),
        settingsVisibleToggle: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...dataProps,
            ...dispatchProps,
            ...getRouterProps(),
            ...overrides,
        };
        return <DeviceInterfaces {...props} />;
    };

    /* tslint:disable */
    const modelDefinition = {
        "@id": "urn:azureiot:ModelDiscovery:DigitalTwin:1",
        "@type": "Interface",
        "displayName": "Digital Twin",
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
        const wrapper = mountWithLocalization(getComponent());
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(Shimmer)).toHaveLength(1);
    });

    it('show interface information when status is failed', () => {

        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                {getComponent({
                    isLoading: false,
                    modelDefinitionWithSource: {
                        modelDefinition,
                        modelDefinitionSynchronizationStatus: SynchronizationStatus.failed,
                        source: REPOSITORY_LOCATION_TYPE.None
                    }
                })}
            </LocalizationContextProvider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('show interface information when status is fetched', () => {

        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                {getComponent({
                    isLoading: false,
                    modelDefinitionWithSource: {
                        modelDefinitionSynchronizationStatus: SynchronizationStatus.failed,
                        source: REPOSITORY_LOCATION_TYPE.None
                    }
                })}
            </LocalizationContextProvider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
