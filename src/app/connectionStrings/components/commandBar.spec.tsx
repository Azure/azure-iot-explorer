/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { ConnectionStringCommandBar } from './commandBar';
import { connectionStringsStateInitial } from '../state';
import * as connectionStringContext from '../context/connectionStringStateContext';
import * as authenticationStateContext from '../../authentication/context/authenticationStateContext';
import { getInitialAuthenticationState } from '../../authentication/state';
import { CommandBarV9 as CommandBar } from '../../shared/components/commandBarV9';


describe('ConnectionStringCommandBar', () => {
    it('renders without crashing', () => {
        const { container } = render(<ConnectionStringCommandBar/>);
        expect(container).toBeDefined();
    });
});
