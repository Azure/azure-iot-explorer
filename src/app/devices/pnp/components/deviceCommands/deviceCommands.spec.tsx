/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommands } from './deviceCommands';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' })
}));

describe('components/devices/deviceCommands', () => {
    const mockGetModelDefinition = jest.fn();

    beforeEach(() => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                modelDefinitionWithSource: {
                    payload: { modelDefinition: { contents: [] }, isModelValid: true },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: mockGetModelDefinition
        });
    });

    it('renders refresh and close buttons', () => {
        render(<MemoryRouter><DeviceCommands/></MemoryRouter>);

        expect(screen.getByText('deviceCommands.command.refresh')).toBeInTheDocument();
        expect(screen.getByText('deviceCommands.command.close')).toBeInTheDocument();
    });

    it('renders no commands label when there are no command schemas', () => {
        render(<MemoryRouter><DeviceCommands/></MemoryRouter>);

        expect(screen.getByText(/deviceCommands\.noCommands/)).toBeInTheDocument();
    });
});
