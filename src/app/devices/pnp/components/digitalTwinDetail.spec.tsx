/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { DigitalTwinDetail } from './digitalTwinDetail';
import * as pnpStateContext from '../../../shared/contexts/pnpStateContext';
import { PnpStateInterface, pnpStateInitial } from '../state';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

const search = '?id=device1&componentName=foo&interfaceId=urn:iotInterfaces:com:interface1:1';
const pathname = `/#/devices/deviceDetail/ioTPlugAndPlay/${search}`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search, pathname }),
    useRouteMatch: () => ({ url: pathname })
}));

describe('DigitalTwinDetail', () => {
    it('matches snapshot', () => {
        const initialState: PnpStateInterface = pnpStateInitial().merge({
            digitalTwin: {
                synchronizationStatus: SynchronizationStatus.working
            }
        });
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({ pnpState: initialState, dispatch: jest.fn()});
        expect(shallow(<DigitalTwinDetail/>)).toMatchSnapshot();
    });
});
