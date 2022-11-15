/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DigitalTwinModelId } from './digitalTwinModelId';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../../../shared/contexts/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn()}),
    useLocation: () => ({ search: '?deviceId=testDevice' }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitalTwinModelId', () => {
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

        const wrapper = shallow(<DigitalTwinModelId/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('matches snapshot when model id is retrieved', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            twin: {
                payload: {
                    deviceId: 'testDevice',
                    moduleId: 'moduleId'
                } as any,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        });

        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});

        const wrapper = shallow(<DigitalTwinModelId/>);
        expect(wrapper).toMatchSnapshot();
    });
});
