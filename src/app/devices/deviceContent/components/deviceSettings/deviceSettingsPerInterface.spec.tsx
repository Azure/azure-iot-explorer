/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import DeviceSettingsPerInterface, { DeviceSettingDataProps, DeviceSettingDispatchProps, DeviceSettingState } from './deviceSettingsPerInterface';
import { mountWithLocalization } from '../../../../shared/utils/testHelpers';
import { twinWithSchema } from './deviceSettings.spec';

describe('components/devices/deviceSettingsPerInterface', () => {

    const deviceSettingsProps: DeviceSettingDataProps = {
        deviceId: 'testDevice',
        interfaceId: 'urn:contoso:com:EnvironmentalSensor:1',
        interfaceName: 'environmentalSensor',
        twinWithSchema: [twinWithSchema]
    };

    const deviceSettingsDispatchProps: DeviceSettingDispatchProps = {
        patchDigitalTwinInterfaceProperties: jest.fn()
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...deviceSettingsProps,
            ...deviceSettingsDispatchProps,
            ...overrides
        };

        return mountWithLocalization(
            <DeviceSettingsPerInterface {...props} />
        );
    };

    it('matches snapshot', () => {
        expect(getComponent()).toMatchSnapshot();
    });

    it('toggles collapsed', () => {
        const wrapper = getComponent();
        expect((wrapper.state() as DeviceSettingState).allCollapsed).toBeFalsy();
        const button = wrapper.find(IconButton).at(1);
        button.simulate('click');
        wrapper.update();
        expect((wrapper.state() as DeviceSettingState).allCollapsed).toBeTruthy();
    });

    it('executes handle toggle from child', () => {
        const wrapper = getComponent();
        let collapsed = (wrapper.state() as DeviceSettingState).collapseMap.get(0);
        expect(collapsed).toBeFalsy();
        // tslint:disable-next-line:no-magic-numbers
        const button = wrapper.find(IconButton).at(2);
        button.simulate('click');
        wrapper.update();
        collapsed = (wrapper.state() as DeviceSettingState).collapseMap.get(0);
        expect(collapsed).toBeTruthy();
    });
});
