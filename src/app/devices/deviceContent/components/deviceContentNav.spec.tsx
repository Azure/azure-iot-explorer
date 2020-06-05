/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import { DeviceContentNavComponent, DeviceContentNavDataProps, DeviceContentNavDispatchProps, NAV_LINK_ITEMS, NAV_LINK_ITEMS_NONEDGE, NAV_LINK_ITEM_PNP } from './deviceContentNav';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ search: '?deviceId=test' }),
    useRouteMatch: () => ({ url: '' })
}));

describe('components/devices/deviceContentNav', () => {

    const setComponentName = jest.fn();
    const getComponent = (overrides = {}) => {
        const navDataProps: DeviceContentNavDataProps = {
            isEdgeDevice: true,
            isLoading: false,
        };

        const navDispatchProps: DeviceContentNavDispatchProps = {
            setComponentName
        };

        const props = {
            ...navDispatchProps,
            ...navDataProps,
            ...overrides,
        };

        return <DeviceContentNavComponent {...props} />;
    };

    it('matches snapshot when there device is not pnp', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
        const wrapper = mount(getComponent());
        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS.length);
    });

    it('shows non-pnp nav when component is loading', () => {
        const wrapper = mount(getComponent({isLoading: true}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS.length);
    });

    it('shows pnp non-edge nav if device is not edge', () => {
        const wrapper = mount(getComponent({isEdgeDevice: false}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONEDGE.length + 1);
    });

    it('show non-pnp nav and pnp nav when device is pnp', () => {
        const wrapper = mount(getComponent({digitalTwinModelId: 'dtmi:__azureiot:samplemodel;1', isEdgeDevice: false}));

        const navigation = wrapper.find(Nav);
        expect(navigation.props().groups[0].links.length).toEqual(NAV_LINK_ITEMS_NONEDGE.length + 1);
    });
});
