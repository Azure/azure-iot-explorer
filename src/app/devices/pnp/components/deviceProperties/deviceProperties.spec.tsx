/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CommandBar, Shimmer } from '@fluentui/react';
import { DeviceProperties } from './deviceProperties';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { TwinWithSchema } from './dataHelper';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import * as PnpContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { testModelDefinition, testTwin } from './testData';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { getDeviceTwinAction } from '../../actions';

const interfaceId = 'urn:contoso:com:EnvironmentalSensor;1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/ioTPlugAndPlayDetail/properties/?id=device1&componentName=foo&interfaceId=${interfaceId}`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?id=device1&componentName=foo&interfaceId=${interfaceId}` , pathname }),
}));

export const twinWithSchema: TwinWithSchema = {
    propertyModelDefinition: {
        '@type': 'Property',
        'description': 'The state of the device. Two states online/offline are available',
        'displayName': 'Device State',
        'name': 'state',
        'schema': 'boolean'
    },
    propertySchema: {
        description: 'Device State / The state of the device. Two states online/offline are available',
        required: null,
        title: 'state',
        type: 'boolean'
    },
    reportedTwin: null
};

describe('components/devices/deviceProperties', () => {

    const mockFetchedState = (model: ModelDefinition) => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            twin: {
                payload: testTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: {
                    isModelValid: true,
                    modelDefinition: model,
                    source: null,
                },
                synchronizationStatus: SynchronizationStatus.fetched
            }
        };
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
    };

    it('shows Shimmer while loading', () => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            },
            modelDefinitionWithSource: {
                synchronizationStatus: SynchronizationStatus.fetched
            }
        };
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValueOnce({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        const wrapper = mount(<DeviceProperties/>);
        expect(wrapper.find(Shimmer)).toBeDefined();
    });

    it('matches snapshot while interface cannot be found', () => {
        mockFetchedState(null);
        expect(shallow(<DeviceProperties/>)).toMatchSnapshot();
        expect(shallow(<DeviceProperties/>).find(InterfaceNotFoundMessageBar)).toBeDefined();
    });

    it('matches snapshot with one twinWithSchema', () => {
        mockFetchedState(testModelDefinition);
        expect(shallow(<DeviceProperties/>)).toMatchSnapshot();
    });

    it('dispatch action when refresh button is clicked', () => {
        mockFetchedState(testModelDefinition);
        const mockGetDigitalTwinActionSpy = jest.spyOn(getDeviceTwinAction, 'started');
        const wrapper = shallow(<DeviceProperties/>);
        const commandBar = wrapper.find(CommandBar).first();

        act(() => commandBar.props().items[0].onClick(null));
        wrapper.update();
        expect(mockGetDigitalTwinActionSpy).toBeCalled();
    });
});
