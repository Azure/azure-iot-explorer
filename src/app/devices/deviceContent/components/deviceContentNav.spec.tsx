/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import DeviceContentNavComponent from './deviceContentNav';
import { testWithLocalizationContext } from '../../../shared/utils/testHelpers';

const interfaceIds = [
    'urn:azureiot:com:DeviceInformation:1'
];

describe('components/devices/deviceContentNav', () => {

    it('matches snapshot when there device is not pnp', () => {
        const wrapper = testWithLocalizationContext(
        <DeviceContentNavComponent
            deviceId="test"
            interfaceIds={[]}
            isLoading={false}
            isPnPDevice={false}
            selectedInterface=""
            setInterfaceId={jest.fn()}
        />);

        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when there is no interface selected', () => {
        const wrapper = testWithLocalizationContext(
        <DeviceContentNavComponent
            deviceId="test"
            interfaceIds={interfaceIds}
            isLoading={false}
            isPnPDevice={true}
            selectedInterface=""
            setInterfaceId={jest.fn()}
        />);

        expect(wrapper).toMatchSnapshot();
    });

    it('redirects snapshot when there is a interface selected', () => {
        const wrapper = testWithLocalizationContext(
        <DeviceContentNavComponent
            deviceId="test"
            interfaceIds={interfaceIds}
            isLoading={false}
            isPnPDevice={true}
            selectedInterface="urn:azureiot:com:DeviceInformation:1"
            setInterfaceId={jest.fn()}
        />);
        expect(wrapper).toMatchSnapshot();
    });
});
