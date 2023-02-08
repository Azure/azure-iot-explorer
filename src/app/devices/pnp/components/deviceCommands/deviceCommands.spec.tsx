/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Shimmer, CommandBar } from '@fluentui/react';
import { DeviceCommands } from './deviceCommands';
import * as PnpContext from '../../context/pnpStateContext';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { pnpStateWithTestData } from './testData';

const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/commands/?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1:1`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1;1', pathname }),
}));

describe('components/devices/deviceCommands', () => {
    it('shows Shimmer while loading', () => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            modelDefinitionWithSource: {
                synchronizationStatus: SynchronizationStatus.working
            }
        };
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        const wrapper = mount(<DeviceCommands/>);
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({pnpState: pnpStateInitial(), dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceCommands/>)).toMatchSnapshot();
        const wrapper = mount(<DeviceCommands/>);
        expect(wrapper.find(InterfaceNotFoundMessageBar)).toBeDefined();
    });

    it('matches snapshot with a commandSchema', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({pnpState: pnpStateWithTestData, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceCommands/>)).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        const getModelDefinitionSpy = jest.fn();
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({pnpState: pnpStateInitial(), dispatch: jest.fn(), getModelDefinition: getModelDefinitionSpy});
        const wrapper = shallow(<DeviceCommands/>);
        const commandBar = wrapper.find(CommandBar).first();

        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(getModelDefinitionSpy).toBeCalled();
    });
});
