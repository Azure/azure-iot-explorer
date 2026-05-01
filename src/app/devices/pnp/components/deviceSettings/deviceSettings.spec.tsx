/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettings } from './deviceSettings';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' })
}));

describe('deviceSettings', () => {
    beforeEach(() => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                twin: { payload: null, synchronizationStatus: SynchronizationStatus.fetched },
                modelDefinitionWithSource: {
                    payload: { modelDefinition: { contents: [] }, isModelValid: true },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });
    });

    it('renders refresh and close buttons', () => {
        render(<MemoryRouter><DeviceSettings/></MemoryRouter>);

        expect(screen.getByText('deviceSettings.command.refresh')).toBeDefined();
        expect(screen.getByText('deviceSettings.command.close')).toBeDefined();
    });

    it('shows no settings label when there are no settings', () => {
        render(<MemoryRouter><DeviceSettings/></MemoryRouter>);

        expect(screen.getByText(/deviceSettings\.noSettings/)).toBeDefined();
    });
});
