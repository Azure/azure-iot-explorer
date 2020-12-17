/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Commands } from './commands';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { appConfig, HostMode } from '../../../../appConfig/appConfig';

const search = '?deviceId=test&componentName=DEFAULT_COMPONENT&interfaceId=dtmi:com:example:Thermostat;1';
const pathname = `#devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/events/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname, push: jest.fn() })
}));

describe('commands', () => {
    it('matches snapshot in electron', () => {
        appConfig.hostMode = HostMode.Electron;
        expect(shallow(
            <Commands
                startDisabled={true}
                synchronizationStatus={SynchronizationStatus.fetched}
                monitoringData={true}
                showSystemProperties={true}
                showPnpModeledEvents={true}
                showSimulationPanel={true}
                setMonitoringData={jest.fn()}
                setShowSystemProperties={jest.fn()}
                setShowPnpModeledEvents={jest.fn()}
                setShowSimulationPanel={jest.fn()}
                dispatch={jest.fn()}
                fetchData={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('matches snapshot in hosted environment', () => {
        appConfig.hostMode = HostMode.Browser;
        expect(shallow(
            <Commands
                startDisabled={false}
                synchronizationStatus={SynchronizationStatus.updating}
                monitoringData={false}
                showSystemProperties={false}
                showPnpModeledEvents={false}
                showSimulationPanel={false}
                setMonitoringData={jest.fn()}
                setShowSystemProperties={jest.fn()}
                setShowPnpModeledEvents={jest.fn()}
                setShowSimulationPanel={jest.fn()}
                dispatch={jest.fn()}
                fetchData={jest.fn()}
            />)).toMatchSnapshot();
    });

    it('makes expected calls', () => {
        const mockSetMonitoringData = jest.fn();
        const mockSetShowPnpModeledEvents = jest.fn();
        const mockSetShowSystemProperties = jest.fn();
        const mockDispatch = jest.fn();
        const wrapper = mount(
            <Commands
                startDisabled={false}
                synchronizationStatus={SynchronizationStatus.fetched}
                monitoringData={true}
                showSystemProperties={true}
                showPnpModeledEvents={true}
                showSimulationPanel={true}
                setMonitoringData={mockSetMonitoringData}
                setShowSystemProperties={mockSetShowSystemProperties}
                setShowPnpModeledEvents={mockSetShowPnpModeledEvents}
                setShowSimulationPanel={jest.fn()}
                dispatch={jest.fn()}
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
