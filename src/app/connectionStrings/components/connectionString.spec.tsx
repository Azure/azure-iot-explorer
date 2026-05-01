/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectionString, ConnectionStringProps } from './connectionString';
import { ConnectionStringDelete } from './connectionStringDelete';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('connectionString', () => {
    it('renders without crashing', () => {
        const props = {
            connectionStringWithExpiry: { connectionString: 'HostName=test.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=abc123' },
            onEditConnectionString: jest.fn(),
            onDeleteConnectionString: jest.fn(),
            onSelectConnectionString: jest.fn()
        };
        const { container } = render(<MemoryRouter><ConnectionString {...props as any}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
