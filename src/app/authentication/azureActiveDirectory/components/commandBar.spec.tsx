/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { AzureActiveDirectoryCommandBar } from './commandBar';
import { getInitialAzureActiveDirectoryState } from '../state';
import * as azureActiveDirectoryStateContext from '../context/azureActiveDirectoryStateContext';
import * as authenticationStateContext from '../../../authentication/context/authenticationStateContext';
import { getInitialAuthenticationState } from '../../../authentication/state';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';


describe('AzureActiveDirectoryCommandBar', () => {
    it('renders without crashing', () => {
        const { container } = render(<AzureActiveDirectoryCommandBar/>);
        expect(container).toBeDefined();
    });
});
