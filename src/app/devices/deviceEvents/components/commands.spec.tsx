/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { CommandBar } from '@fluentui/react';
import { Commands } from './commands';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';

const search = '?deviceId=test&componentName=DEFAULT_COMPONENT&interfaceId=dtmi:com:example:Thermostat;1';
const pathname = `#devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/events/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname, push: jest.fn() })
}));

describe('commands', () => {
    it('matches snapshot', () => {
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <Commands
                startDisabled={false}
                monitoringData={false}
                showContentTypePanel={true}
                showPnpModeledEvents={false}
                showSimulationPanel={false}
                setShowContentTypePanel={jest.fn()}
                setMonitoringData={jest.fn()}
                setShowPnpModeledEvents={jest.fn()}
                setShowSimulationPanel={jest.fn()}
                fetchData={jest.fn()}
                stopFetching={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('makes expected calls', () => {
        const mockSetMonitoringData = jest.fn();
        const mockSetShowPnpModeledEvents = jest.fn();
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        const wrapper = mount(
            <Commands
                startDisabled={false}
                monitoringData={true}
                showContentTypePanel={true}
                showPnpModeledEvents={true}
                showSimulationPanel={true}
                setMonitoringData={mockSetMonitoringData}
                setShowContentTypePanel={jest.fn()}
                setShowPnpModeledEvents={mockSetShowPnpModeledEvents}
                setShowSimulationPanel={jest.fn()}
                fetchData={jest.fn()}
                stopFetching={jest.fn()}
            />);

            expect(wrapper.find(CommandBar).props().items.length).toEqual(4);
            act(() => {
                wrapper.find(CommandBar).props().items[0].onClick(undefined);
            });
            wrapper.update();
            expect(mockSetMonitoringData).toBeCalledWith(false);

            act(() => {
                wrapper.find(CommandBar).props().items[1].onClick(undefined);
            });
            wrapper.update();
            expect(mockSetShowPnpModeledEvents).toBeCalledWith(false);
    });
});
