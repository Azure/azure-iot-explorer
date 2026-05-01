/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModelRepositoryLocationListItem } from './modelRepositoryLocationListItem';
import { REPOSITORY_LOCATION_TYPE } from '../../constants/repositoryLocationTypes';
import { getInitialModelRepositoryFormState } from '../state';
import { getInitialModelRepositoryFormOps } from '../interface';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('ModelRepositoryLocationListItem', () => {
    it('renders with public repo type showing listitem role', () => {
        const formState = [
            { repositoryLocationSettings: [] },
            { setRepositoryLocationSettings: jest.fn(), setDirtyFlag: jest.fn() }
        ];
        const item = { repositoryLocationType: 'public', value: '' };
        render(<MemoryRouter><ModelRepositoryLocationListItem index={0} item={item as any} formState={formState as any}/></MemoryRouter>);

        expect(screen.getByRole('listitem')).toBeDefined();
    });

    it('renders remove button', () => {
        const formState = [
            { repositoryLocationSettings: [{ repositoryLocationType: 'public', value: '' }] },
            { setRepositoryLocationSettings: jest.fn(), setDirtyFlag: jest.fn() }
        ];
        const item = { repositoryLocationType: 'public', value: '' };
        render(<MemoryRouter><ModelRepositoryLocationListItem index={0} item={item as any} formState={formState as any}/></MemoryRouter>);

        expect(screen.getByLabelText('modelRepository.commands.remove.ariaLabel')).toBeDefined();
    });
});
