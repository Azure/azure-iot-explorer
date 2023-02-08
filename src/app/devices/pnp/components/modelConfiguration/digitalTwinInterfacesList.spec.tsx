/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { DigitalTwinInterfacesList } from './digitalTwinInterfacesList';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
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

describe('DigitalTwinInterfacesList', () => {
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

        const wrapper = shallow(<DigitalTwinInterfacesList/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows shimmer when model id is not retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = mount(<DigitalTwinInterfacesList/>);
        expect(wrapper.find(MultiLineShimmer)).toHaveLength(1);
    });
});
