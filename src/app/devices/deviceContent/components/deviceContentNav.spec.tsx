/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import DeviceContentNavComponent, { DeviceContentNavDataProps, DeviceContentNavDispatchProps, NAV_LINK_ITEMS_NONPNP, NAV_LINK_ITEMS_PNP, NAV_LINK_ITEMS_NONPNP_NONEDGE } from './deviceContentNav';
import { mountWithLocalization, testSnapshot } from '../../../shared/utils/testHelpers';

describe('components/devices/deviceContentNav', () => {

    const setInterfaceId = jest.fn();
    const getComponent = (overrides = {}) => {
        const routeProps = {
            history: jest.fn() as any, // tslint:disable-line:no-any
            location: jest.fn() as any, // tslint:disable-line:no-any
            match: jest.fn() as any, // tslint:disable-line:no-any
        };

        const navDataProps: DeviceContentNavDataProps = {
            deviceId: 'test',
            interfaceIds: [],
            isEdgeDevice: true,
            isLoading: false,
            isPnPDevice: false,
            selectedInterface: '',
        };

        const navDispatchProps: DeviceContentNavDispatchProps = {
            setInterfaceId
        };

        const props = {
            ...navDispatchProps,
            ...navDataProps,
            ...routeProps
            ...overrides,
        };

        return <DeviceContentNavComponent {...props} />;
    };

    it('matches snapshot when there device is not pnp', () => {
        testSnapshot(getComponent());
        const wrapper = mountWithLocalization(getComponent());
        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONPNP.length);
    });

    it('shows non-pnp nav when component is loading', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: true}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONPNP.length);
    });

    it('shows non-pnp non-edge nav if device is not edge', () => {
        const wrapper = mountWithLocalization(getComponent({isEdgeDevice: false}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONPNP_NONEDGE.length);
    });

    it('show non-pnp nav and pnp nav when device is pnp', () => {
        const interfaceId = 'urn:azureiot:com:DeviceInformation:1';
        const interfaceIds = [interfaceId];
        const wrapper = mountWithLocalization(getComponent({isPnPDevice: true, interfaceIds}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONPNP.length);
        expect(navigation.props().groups[1].links.length).toEqual(interfaceIds.length);
        expect(navigation.props().groups[1].links[0].links.length).toEqual(NAV_LINK_ITEMS_PNP.length);

        navigation.props().groups[1].links[0].links[0].onClick(undefined, {name: '', url: '', parentId: interfaceId});
        expect(setInterfaceId).toBeCalledWith(interfaceId);
    });
});
