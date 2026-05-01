/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CloudToDeviceMessage, systemPropertyKeyNameMappings } from './cloudToDeviceMessage';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { cloudToDeviceMessageAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('cloudToDeviceMessage', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><CloudToDeviceMessage/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
