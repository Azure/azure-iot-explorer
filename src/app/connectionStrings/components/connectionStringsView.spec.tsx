/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectionStringsView } from './connectionStringsView';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../context/connectionStringStateContext', () => ({
    useConnectionStringContext: () => [
        { payload: [], synchronizationStatus: 'fetched' },
        { setConnectionStrings: jest.fn(), upsertConnectionString: jest.fn(), deleteConnectionString: jest.fn(), getConnectionStrings: jest.fn() }
    ]
}));

jest.mock('../../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

describe('ConnectionStringsView', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><ConnectionStringsView/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
