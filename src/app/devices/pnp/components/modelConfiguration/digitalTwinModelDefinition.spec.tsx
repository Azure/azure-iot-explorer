/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { Label , Announced, MessageBar,Pivot, PivotItem } from '@fluentui/react';
import { DigitalTwinModelDefinition } from './digitalTwinModelDefinition';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../../../shared/contexts/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const interfaceId = 'urn:azureiot:samplemodel;1';

/* tslint:disable */
const deviceTwin: any = {
    "deviceId": "testDevice",
    "modelId": interfaceId,
    "properties" : {
        desired: {
            environmentalSensor: {
                brightness: 456,
                __t: 'c'
            }
        },
        reported: {
            environmentalSensor: {
                brightness: {
                    value: 123,
                    dv: 2
                },
                __t: 'c'
            }
        }
    }
};
/* tslint:enable */

const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn()}),
    useLocation: () => ({ search: '?deviceId=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitalTwinModelDefinition', () => {
    it('matches snapshot', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitalTwinModelDefinition/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows shimmer when model id is not retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            },
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.working
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = mount(<DigitalTwinModelDefinition/>);
        expect(wrapper.find(MultiLineShimmer)).toHaveLength(1);
    });

    it('matches snapshot when empty model id is retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: {
                    deviceId: 'testDevice',
                    moduleId: ''
                } as any,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitalTwinModelDefinition/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows model id with no model definition found', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: deviceTwin,
                synchronizationStatus: SynchronizationStatus.fetched
            },
            modelDefinitionWithSource: {
                payload: null,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = mount(<DigitalTwinModelDefinition/>);

        const h4 = wrapper.find('h4');
        expect(h4).toHaveLength(1); // tslint:disable-line:no-magic-numbers
        expect(h4.at(0).props().children).toEqual(ResourceKeys.digitalTwin.steps.secondFailure);
    });
});
