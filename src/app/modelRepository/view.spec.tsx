/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { ModelRepositoryLocationView } from './view';
import { REPOSITORY_LOCATION_TYPE } from '../constants/repositoryLocationTypes';
import * as ModelRepositoryContext from '../shared/modelRepository/context/modelRepositoryStateContext';
import { getInitialModelRepositoryState } from '../shared/modelRepository/state';
import { getInitialModelRepositoryActions } from '../shared/modelRepository/interface';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: 'url', search: '', hash: '', state: null, key: 'default' })
}));
jest.mock('../navigation/hooks/useBreadcrumbEntry', () => ({
    useBreadcrumbEntry: jest.fn()
}));

describe('view', () => {
    it('renders when no locations', () => {
        jest.spyOn(ModelRepositoryContext, 'useModelRepositoryContext').mockReturnValueOnce([getInitialModelRepositoryState(), getInitialModelRepositoryActions()]);
        const { container } = render(<MemoryRouter><ModelRepositoryLocationView /></MemoryRouter>);
        expect(container).toBeDefined();
    });

    it('renders when locations greater than 0', () => {
        const initialState = [
            ...getInitialModelRepositoryState(),
            {
                repositoryLocationType: REPOSITORY_LOCATION_TYPE.Configurable,
                value: 'd:/'
            }
        ];
        jest.spyOn(ModelRepositoryContext, 'useModelRepositoryContext').mockReturnValueOnce([initialState, getInitialModelRepositoryActions()]);
        const { container } = render(<MemoryRouter><ModelRepositoryLocationView /></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
