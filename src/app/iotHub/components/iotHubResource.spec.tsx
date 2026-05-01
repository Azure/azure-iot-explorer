/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { IotHubResource } from './iotHubResource';
import * as BreadcrumbEntry from '../../navigation/hooks/useBreadcrumbEntry';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ resourceName: 'resource'}),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('IotHubResource', () => {
    it('matches snapshot', () => {
        jest.spyOn(BreadcrumbEntry, 'useBreadcrumbEntry').mockImplementation(() => {});
        expect(render(<MemoryRouter><IotHubResource /></MemoryRouter>)).toBeDefined();
    });
});