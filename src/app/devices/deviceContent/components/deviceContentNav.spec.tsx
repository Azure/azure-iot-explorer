/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import DeviceContentNavComponent, { DeviceContentNavDataProps, DeviceContentNavDispatchProps, NAV_LINK_ITEMS, NAV_LINK_ITEMS_NONEDGE, NAV_LINK_ITEM_PNP } from './deviceContentNav';
import { mountWithLocalization, testSnapshot } from '../../../shared/utils/testHelpers';

describe('components/devices/deviceContentNav', () => {

    const setComponentName = jest.fn();
    const getComponent = (overrides = {}) => {
        const routeProps = {
            history: jest.fn() as any, // tslint:disable-line:no-any
            location: jest.fn() as any, // tslint:disable-line:no-any
            match: jest.fn() as any, // tslint:disable-line:no-any
        };

        const navDataProps: DeviceContentNavDataProps = {
            deviceId: 'test',
            digitalTwinModelId: '',
            isEdgeDevice: true,
            isLoading: false,
        };

        const navDispatchProps: DeviceContentNavDispatchProps = {
            setComponentName
        };

        const props = {
            ...navDispatchProps,
            ...navDataProps,
            ...routeProps,
            ...overrides,
        };

        return <DeviceContentNavComponent {...props} />;
    };

    it('matches snapshot when there device is not pnp', () => {
        testSnapshot(getComponent());
        const wrapper = mountWithLocalization(getComponent());
        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS.length);
    });

    it('shows non-pnp nav when component is loading', () => {
        const wrapper = mountWithLocalization(getComponent({isLoading: true}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS.length);
    });

    it('shows non-pnp non-edge nav if device is not edge', () => {
        const wrapper = mountWithLocalization(getComponent({isEdgeDevice: false}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONEDGE.length);
    });

    it('show non-pnp nav and pnp nav when device is pnp', () => {
        const wrapper = mountWithLocalization(getComponent({digitalTwinModelId: 'dtmi:__azureiot:samplemodel;1', isEdgeDevice: false}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONEDGE.length + 1);
    });
});
