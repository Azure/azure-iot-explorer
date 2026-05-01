/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { BackButton } from './backButton';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';

import { render } from '@testing-library/react';
describe('BackButton', () => {
    it('matches snapshot ', () => {
        jest.spyOn(azureActiveDirectoryStateContext, 'useAzureActiveDirectoryStateContext').mockReturnValue(
            [getInitialAzureActiveDirectoryState(), azureActiveDirectoryStateContext.getInitialAzureActiveDirectoryOps()]);
        const { container } = render(<BackButton backToSubscription={jest.fn()}/>);
        expect(container).toBeDefined();
    });
});
