/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { Toggle, TextField } from '@fluentui/react';
import { StartTime } from './startTime';

const search = '?deviceId=test&componentName=DEFAULT_COMPONENT&interfaceId=dtmi:com:example:Thermostat;1';
const pathname = `#devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/events/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname, push: jest.fn() })
}));

describe('startTime', () => {
    it('matches snapshot', () => {
        expect(shallow(
            <StartTime
                monitoringData={true}
                specifyStartTime={true}
                startTime={new Date(0)}
                setSpecifyStartTime={jest.fn()}
                setStartTime={jest.fn()}
                setHasError={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('specifies start time string', () => {
        const mockSetSpecifyStartTime = jest.fn();
        const mockSetStartTime = jest.fn();
        const MockSetHasError = jest.fn();
        const wrapper = mount(
            <StartTime
                monitoringData={false}
                specifyStartTime={true}
                startTime={new Date(0)}
                setSpecifyStartTime={mockSetSpecifyStartTime}
                setStartTime={mockSetStartTime}
                setHasError={MockSetHasError}
            />);

        act(() => wrapper.find(Toggle).first().props().onChange?.(undefined as any, false));
        wrapper.update();
        expect(mockSetSpecifyStartTime).toBeCalledWith(false);

        act(() => wrapper.find(TextField).props().onChange?.(undefined as any, '2020/12/16/12/58/00'));
        wrapper.update();
        expect(mockSetStartTime).toBeCalledTimes(2);
        expect(mockSetStartTime.mock.calls[1][0]).toEqual(new Date(2020, 11, 16, 12, 58, 0));
        expect(MockSetHasError).toBeCalledWith(false);
    });
});
