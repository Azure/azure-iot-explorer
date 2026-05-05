/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceTwin } from './deviceTwin';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/detail/twin/', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' })
}));

jest.mock('../../../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

describe('DeviceTwin', () => {
    it('renders refresh and save command bar buttons when twin is loaded', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
            { deviceTwin: { payload: { deviceId: 'testDevice' }, synchronizationStatus: SynchronizationStatus.fetched } },
            jest.fn()
        ]);

        render(<MemoryRouter><DeviceTwin/></MemoryRouter>);

        expect(screen.getByText('deviceTwin.command.refresh')).toBeInTheDocument();
        expect(screen.getByText('deviceTwin.command.save')).toBeInTheDocument();
    });

    it('renders header view', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
            { deviceTwin: { payload: { deviceId: 'testDevice' }, synchronizationStatus: SynchronizationStatus.fetched } },
            jest.fn()
        ]);

        render(<MemoryRouter><DeviceTwin/></MemoryRouter>);

        expect(screen.getByText('deviceTwin.headerText')).toBeInTheDocument();
    });

    it('shows shimmer when syncing', () => {
        jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
            { deviceTwin: { payload: undefined, synchronizationStatus: SynchronizationStatus.working } },
            jest.fn()
        ]);

        render(<MemoryRouter><DeviceTwin/></MemoryRouter>);

        // MultiLineShimmer renders with role="status"
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
