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
import { appConfig, HostMode } from '../../../../appConfig/appConfig';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';

const search = '?deviceId=test&componentName=DEFAULT_COMPONENT&interfaceId=dtmi:com:example:Thermostat;1';
const pathname = `#devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/events/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname, push: jest.fn() })
}));

describe('commands', () => {
    it('matches snapshot in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <Commands
                startDisabled={true}
                monitoringData={true}
                showDecoderPanel={true}
                showSystemProperties={true}
                showPnpModeledEvents={true}
                showSimulationPanel={true}
                setShowDecoderPanel={jest.fn()}
                setMonitoringData={jest.fn()}
                setShowSystemProperties={jest.fn()}
                setShowPnpModeledEvents={jest.fn()}
                setShowSimulationPanel={jest.fn()}
                fetchData={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('matches snapshot in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        expect(shallow(
            <Commands
                startDisabled={false}
                monitoringData={false}
                showDecoderPanel={true}
                showSystemProperties={false}
                showPnpModeledEvents={false}
                showSimulationPanel={false}
                setShowDecoderPanel={jest.fn()}
                setMonitoringData={jest.fn()}
                setShowSystemProperties={jest.fn()}
                setShowPnpModeledEvents={jest.fn()}
                setShowSimulationPanel={jest.fn()}
                fetchData={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('makes expected calls', () => {
        const mockSetMonitoringData = jest.fn();
        const mockSetShowPnpModeledEvents = jest.fn();
        const mockSetShowSystemProperties = jest.fn();
        jest.spyOn(deviceEventsStateContext, 'useDeviceEventsStateContext').mockReturnValue(
            [getInitialDeviceEventsState(), deviceEventsStateContext.getInitialDeviceEventsOps()]);
        const wrapper = mount(
            <Commands
                startDisabled={false}
                monitoringData={true}
                showDecoderPanel={true}
                showSystemProperties={true}
                showPnpModeledEvents={true}
                showSimulationPanel={true}
                setMonitoringData={mockSetMonitoringData}
                setShowDecoderPanel={jest.fn()}
                setShowSystemProperties={mockSetShowSystemProperties}
                setShowPnpModeledEvents={mockSetShowPnpModeledEvents}
                setShowSimulationPanel={jest.fn()}
                fetchData={jest.fn()}
            />);

            expect(wrapper.find(CommandBar).props().items.length).toEqual(5);
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


            act(() => {
                wrapper.find(CommandBar).props().items[2].onClick(undefined);
            });
            wrapper.update();
            expect(mockSetShowSystemProperties).toBeCalledWith(false);
    });
});
