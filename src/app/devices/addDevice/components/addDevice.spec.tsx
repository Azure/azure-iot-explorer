/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddDevice } from './addDevice';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/devices/add', search: '', hash: '', state: null, key: 'default' })
}));

jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValue([
    { synchronizationStatus: SynchronizationStatus.initialized },
    jest.fn()
]);

describe('AddDevice', () => {
    it('renders device ID input field', () => {
        render(<MemoryRouter><AddDevice/></MemoryRouter>);

        expect(screen.getByText('deviceIdentity.deviceID')).toBeInTheDocument();
    });

    it('renders authentication type section', () => {
        render(<MemoryRouter><AddDevice/></MemoryRouter>);

        expect(screen.getByText('deviceIdentity.authenticationType.symmetricKey.type')).toBeInTheDocument();
    });

    it('renders save and close command bar buttons', () => {
        render(<MemoryRouter><AddDevice/></MemoryRouter>);

        expect(screen.getByText('deviceLists.commands.save')).toBeInTheDocument();
        expect(screen.getByText('deviceLists.commands.close')).toBeInTheDocument();
    });

    it('renders hub connectivity switch', () => {
        render(<MemoryRouter><AddDevice/></MemoryRouter>);

        expect(screen.getByText('deviceIdentity.hubConnectivity.label')).toBeInTheDocument();
    });
});
