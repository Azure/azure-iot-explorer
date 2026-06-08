/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IotHubHost } from './iotHubHost';
import * as BreadcrumbEntry from '../../navigation/hooks/useBreadcrumbEntry';

import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ hostName: 'host'}),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHubHost', () => {
    it('matches snapshot', async () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        await act(async () => {
            expect(render(<MemoryRouter><IotHubHost /></MemoryRouter>)).toBeDefined();
        });
    });
});