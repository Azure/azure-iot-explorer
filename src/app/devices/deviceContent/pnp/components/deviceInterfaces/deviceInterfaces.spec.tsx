/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DeviceInterfaces, DeviceInterfaceProps, DeviceInterfaceDispatchProps } from './deviceInterfaces';
import { REPOSITORY_LOCATION_TYPE } from '../../../../../constants/repositoryLocationTypes';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ pathname: '/devices', search: '' }),
}));

describe('components/devices/deviceInterfaces', () => {
    const dataProps: DeviceInterfaceProps = {
        isLoading: true,
        modelDefinitionWithSource: null,
    };

    const settingsVisibleToggle = jest.fn();
    const refresh = jest.fn();
    const dispatchProps: DeviceInterfaceDispatchProps = {
        refresh,
        setComponentName: jest.fn(),
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...dataProps,
            ...dispatchProps,
            ...overrides,
        };
        return <DeviceInterfaces {...props} />;
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

    it('shows Shimmer when status is working', () => {
        const wrapper = mount(getComponent());
        expect(wrapper).toMatchSnapshot();
    });

    it('shows interface information when status is fetched', () => {
        const wrapper = shallow(getComponent({
            isLoading: false,
            modelDefinitionWithSource: {
                isModelValid: true,
                modelDefinition,
                source: REPOSITORY_LOCATION_TYPE.Public
            }
        }));
        expect(wrapper).toMatchSnapshot();

        const command = wrapper.find(CommandBar);
        act(() => command.props().items[0].onClick(null));
        expect(refresh).toBeCalled();
    });
});
