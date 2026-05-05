/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceProperties } from './deviceProperties';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' })
}));

describe('components/devices/deviceProperties', () => {
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

    it('renders refresh and close command bar buttons', () => {
        render(<MemoryRouter><DeviceProperties/></MemoryRouter>);

        expect(screen.getByText('deviceProperties.command.refresh')).toBeInTheDocument();
        expect(screen.getByText('deviceProperties.command.close')).toBeInTheDocument();
    });

    it('shows no properties label when there are no property schemas', () => {
        render(<MemoryRouter><DeviceProperties/></MemoryRouter>);

        expect(screen.getByText(/deviceProperties\.noProperties/)).toBeInTheDocument();
    });
});
