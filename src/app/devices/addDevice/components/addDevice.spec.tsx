/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddDevice } from './addDevice';
import { PasswordField } from '../../../shared/components/passwordField';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import { DeviceAuthenticationType } from '../../../api/models/deviceAuthenticationType';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { addDeviceAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('addDevice', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><AddDevice/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
