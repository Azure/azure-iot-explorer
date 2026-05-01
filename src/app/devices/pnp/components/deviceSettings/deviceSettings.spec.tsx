/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';

import { Skeleton } from '@fluentui/react-components';
import { DeviceSettings } from './deviceSettings';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateWithTestData } from './testData';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

const interfaceId = 'urn:contoso:com:EnvironmentalSensor;1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/settings/?id=device1&componentName=foo&interfaceId=${interfaceId}`;

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useLocation: () => ({ search: `?id=device1&componentName=foo&interfaceId=${interfaceId}`, pathname }),
}));

describe('deviceSettings', () => {
    it('matches snapshot while loading', () => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        };
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        const wrapper = mount(<DeviceSettings/>);
        expect(wrapper.find(Skeleton)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState: pnpStateWithTestData, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceSettings/>)).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        const getModelDefinitionSpy = jest.fn();
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState: pnpStateWithTestData, dispatch: jest.fn(), getModelDefinition: getModelDefinitionSpy});
        const wrapper = shallow(<DeviceSettings/>);
        const commandBar = wrapper.find(CommandBar).first();
        commandBar.props().items[0].onClick(null);
        wrapper.update();
        expect(getModelDefinitionSpy).toBeCalled();
    });
});
