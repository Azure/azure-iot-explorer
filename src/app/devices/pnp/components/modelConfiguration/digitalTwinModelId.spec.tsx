/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { DigitalTwinModelId } from './digitalTwinModelId';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

import { render } from '@testing-library/react';
const pathname = 'resources/TestHub.azure-devices.net/devices/deviceDetail/ioTPlugAndPlay/?deviceId=testDevice';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

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

        const { container } = render(<DigitalTwinModelId/>);
        expect(container).toBeDefined();
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

        const { container } = render(<DigitalTwinModelId/>);
        expect(container).toBeDefined();
    });
});