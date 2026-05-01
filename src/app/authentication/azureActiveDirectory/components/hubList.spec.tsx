/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { HubList } from './hubList';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

import { render } from '@testing-library/react';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' })
}));

describe('HubList', () => {
    it('matches snapshot when there are no list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), formState: 'idle'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubList/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when there are list items', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), iotHubs: [{
            name: 'hub',
            location: 'westus',
            id: 'id'
        }]}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubList/>);
        expect(container).toBeDefined();
    });
});