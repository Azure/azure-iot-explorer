/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppVersionMessageBar } from './appVersionMessageBar';
import * as AppVersionHelper from '../utils/appVersionHelper';
import * as githubService from '../../api/services/githubService';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('components/devices/appVersionMessageBar', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><AppVersionMessageBar/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
