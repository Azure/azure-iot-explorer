/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { DeviceEvents } from './deviceEvents';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as pnpStateContext from '../../pnp/context/pnpStateContext';
import { pnpStateInitial, PnpStateInterface } from '../../pnp/state';
const pathname = `#/devices/detail/events/?id=device1`;
jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: `?deviceId=device1`, pathname, push: jest.fn() })
}));

describe('deviceEvents', () => {
    it('matches snapshot when loading', () => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            modelDefinitionWithSource: {
                payload: undefined,
                synchronizationStatus: SynchronizationStatus.working
            }
        };
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
    });

    it('matches snapshot after loaded', () => {
        const pnpState: PnpStateInterface = {
            ...pnpStateInitial(),
            modelDefinitionWithSource: {
                payload: undefined,
                synchronizationStatus: SynchronizationStatus.fetched
            }
        };
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({pnpState, dispatch: jest.fn(), getModelDefinition: jest.fn()});
        expect(shallow(<DeviceEvents/>)).toMatchSnapshot();
    });
});