/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { TabList, Tab } from '@fluentui/react-components';
import { DeviceContentNavComponent, DeviceContentNavProps, NAV_LINK_ITEMS_DEVICE, NAV_LINK_ITEMS_NONEDGE_DEVICE } from './deviceContentNav';

jest.mock('react-router-dom', () => ({
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' }),

}));

describe('deviceContentNav', () => {
    const getComponent = (overrides = {}) => {
        const navDataProps: DeviceContentNavProps = {
            isEdgeDevice: true
        };

        const props = {
            ...navDataProps,
            ...overrides,
        };

        return <DeviceContentNavComponent {...props} />;
    };

    it('matches snapshot when the device is edge', () => {
        expect(shallow(getComponent())).toMatchSnapshot();
        const wrapper = mount(getComponent());
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(NAV_LINK_ITEMS_DEVICE.length);
    });

    it('matches snapshot when the device is not edge', () => {
        expect(shallow(getComponent({ isEdgeDevice: false }))).toMatchSnapshot();
        const wrapper = mount(getComponent({ isEdgeDevice: false }));
        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(NAV_LINK_ITEMS_NONEDGE_DEVICE.length);
    });

    it('shows non-pnp nav when component is loading', () => {
        const wrapper = mount(getComponent({isLoading: true}));

        const tabs = wrapper.find(Tab);
        expect(tabs.length).toEqual(NAV_LINK_ITEMS_DEVICE.length);
    });
});
