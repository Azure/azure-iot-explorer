/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelRepositoryLocationList } from './modelRepositoryLocationList';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ModelRepositoryLocationList', () => {
    it('renders the list container', () => {
        const formState = [
            { repositoryLocationSettings: [] },
            { setRepositoryLocationSettings: jest.fn(), setDirtyFlag: jest.fn() }
        ];
        const { container } = render(<MemoryRouter><ModelRepositoryLocationList formState={formState as any}/></MemoryRouter>);
        expect(container.firstChild).toBeDefined();
    });

    it('renders items when settings are provided', () => {
        const formState = [
            { repositoryLocationSettings: [{ repositoryLocationType: 'public', value: '' }] },
            { setRepositoryLocationSettings: jest.fn(), setDirtyFlag: jest.fn() }
        ];
        const { container } = render(<MemoryRouter><ModelRepositoryLocationList formState={formState as any}/></MemoryRouter>);
        expect(container.querySelectorAll('[role="listitem"]').length).toBeGreaterThan(0);
    });
});
