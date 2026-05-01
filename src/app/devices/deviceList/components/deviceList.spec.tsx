/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceList } from './deviceList';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/', search: '', hash: '', state: null, key: 'default' })
}));

jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
    {
        devices: [],
        synchronizationStatus: SynchronizationStatus.fetched,
        deviceQuery: {
            clauses: [],
            continuationTokens: [],
            currentPageIndex: 0,
            deviceId: '',
        }
    },
    jest.fn()
]);

describe('DeviceList', () => {
    it('renders no device text when list is empty', () => {
        render(<MemoryRouter><DeviceList/></MemoryRouter>);

        expect(screen.getAllByText('deviceLists.noDevice').length).toBeGreaterThan(0);
    });

    it('renders add device button', () => {
        render(<MemoryRouter><DeviceList/></MemoryRouter>);

        expect(screen.getByText('deviceLists.commands.add')).toBeDefined();
    });

    it('renders device query search area', () => {
        render(<MemoryRouter><DeviceList/></MemoryRouter>);

        expect(screen.getByLabelText('deviceLists.query.deviceId.ariaLabel')).toBeDefined();
    });
});
