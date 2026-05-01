/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddModuleIdentity } from './addModuleIdentity';
import { PasswordField } from '../../../../shared/components/passwordField';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { addModuleIdentityAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

describe('devices/components/addModuleIdentity', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><AddModuleIdentity/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
