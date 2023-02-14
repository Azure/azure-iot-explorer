/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Toggle, TextField } from '@fluentui/react';
import { CustomEventHub } from './customEventHub';

const search = '?deviceId=test&componentName=DEFAULT_COMPONENT&interfaceId=dtmi:com:example:Thermostat;1';
const pathname = `#devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/events/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname, push: jest.fn() })
}));

describe('customEventHub', () => {
    it('matches snapshot', () => {
        expect(shallow(
            <CustomEventHub
                monitoringData={true}
                useBuiltInEventHub={false}
                customEventHubConnectionString={''}
                setUseBuiltInEventHub={jest.fn()}
                setCustomEventHubConnectionString={jest.fn()}
                setHasError={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('specifies custom strings', () => {
        const mockSetUseBuiltInEventHub = jest.fn();
        const mockSetCustomEventHubName = jest.fn();
        const mockSetCustomEventHubConnectionString = jest.fn();
        const wrapper = mount(
            <CustomEventHub
                monitoringData={true}
                useBuiltInEventHub={false}
                customEventHubConnectionString={''}
                setUseBuiltInEventHub={mockSetUseBuiltInEventHub}
                setCustomEventHubConnectionString={mockSetCustomEventHubConnectionString}
                setHasError={jest.fn()}
            />);

        act(() => wrapper.find(Toggle).first().props().onChange?.(undefined as any, false));
        wrapper.update();
        expect(mockSetUseBuiltInEventHub).toBeCalledWith(true);

        act(() => wrapper.find(TextField).first().props().onChange?.(undefined as any, 'connectionString'));
        wrapper.update();
        expect(mockSetCustomEventHubConnectionString).toBeCalledWith('connectionString');
    });
});
