/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Commands } from './commands';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('commands', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><Commands/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
