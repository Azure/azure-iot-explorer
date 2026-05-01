/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddModuleIdentity } from './addModuleIdentity';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=testDevice', hash: '', state: null, key: 'default' })
}));

describe('devices/components/addModuleIdentity', () => {
    it('renders save and cancel buttons', () => {
        render(<MemoryRouter><AddModuleIdentity/></MemoryRouter>);

        expect(screen.getByText('moduleIdentity.command.save')).toBeDefined();
        expect(screen.getByText('moduleIdentity.command.cancel')).toBeDefined();
    });

    it('renders module ID input field', () => {
        render(<MemoryRouter><AddModuleIdentity/></MemoryRouter>);

        expect(screen.getByLabelText('moduleIdentity.moduleId')).toBeDefined();
    });
});
