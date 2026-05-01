/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { HubSelection } from './hubSelection';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

import { render } from '@testing-library/react';
describe('HubSelection', () => {
    it('matches snapshot when page is loading', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), formState: 'working'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when token is present', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [{...getInitialAzureActiveDirectoryState(), token: 'token'}, azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });

    it('matches snapshot when hub list is shown', () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(() => React.useState(true));
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<HubSelection/>);
        expect(container).toBeDefined();
    });
});
