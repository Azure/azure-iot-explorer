/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { Shimmer } from 'office-ui-fabric-react';
import DeviceInterfaces from './deviceInterfaces';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { LocalizationContextProvider } from '../../../../shared/contexts/localizationContext';

describe('components/devices/deviceContentNav', () => {

    const getRouterProps = (pathname: string, search?: string) => {
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
        const wrapper = shallow(
            <DeviceInterfaces
                modelSyncStatus={SynchronizationStatus.working}
                modelDefinitionWithSource={{modelDefinitionSynchronizationStatus: SynchronizationStatus.working}}
                isLoading={true}
                setInterfaceId={jest.fn()}
                settingsVisibleToggle={jest.fn()}
                refresh={jest.fn()}
                {...getRouterProps('#/devices/detail/digitalTwins/interfaces/', 'id=device1&interfaceId=urn:some:interface:name:1')}
            />
        );
        expect(wrapper.find(Shimmer)).toHaveLength(1);
    });

    it('show interface information when status is failed', () => {

        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                <DeviceInterfaces
                    modelSyncStatus={SynchronizationStatus.failed}
                    modelDefinitionWithSource={{modelDefinitionSynchronizationStatus: SynchronizationStatus.failed}}
                    isLoading={false}
                    setInterfaceId={jest.fn()}
                    settingsVisibleToggle={jest.fn()}
                    refresh={jest.fn()}
                    {...getRouterProps('#/devices/detail/digitalTwins/interfaces/', 'id=device1&interfaceId=urn:some:interface:name:1')}
                />
            </LocalizationContextProvider>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('show interface information when status is fetched', () => {

        const wrapper = (
            <LocalizationContextProvider value={{t: jest.fn((value: string) => value)}}>
                <DeviceInterfaces
                    modelSyncStatus={SynchronizationStatus.fetched}
                    modelDefinitionWithSource={{modelDefinition, modelDefinitionSynchronizationStatus: SynchronizationStatus.fetched, source: REPOSITORY_LOCATION_TYPE.Public}}
                    isLoading={false}
                    setInterfaceId={jest.fn()}
                    settingsVisibleToggle={jest.fn()}
                    refresh={jest.fn()}
                    {...getRouterProps('#/devices/detail/digitalTwins/interfaces/', 'id=device1&interfaceId=urn:some:interface:name:1')}
                />
            </LocalizationContextProvider>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
