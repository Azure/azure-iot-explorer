/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppVersionMessageBar } from './appVersionMessageBar';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

jest.mock('../../api/services/githubService', () => ({
    fetchLatestReleaseTagName: () => Promise.resolve(undefined),
    latestReleaseUrlPath: 'https://example.com'
}));

describe('components/devices/appVersionMessageBar', () => {
    it('renders without message bar when no newer release', () => {
        const { container } = render(<MemoryRouter><AppVersionMessageBar/></MemoryRouter>);

        // When no newer release, should render empty fragment
        expect(container.querySelector('[class*="MessageBar"]')).toBeNull();
    });
});
