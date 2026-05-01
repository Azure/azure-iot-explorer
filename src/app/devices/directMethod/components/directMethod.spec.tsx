/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DirectMethod } from './directMethod';
import { invokeDirectMethodAction } from '../actions';
import * as AsyncSagaReducer from '../../../shared/hooks/useAsyncSagaReducer';
import { CommandBarV9 as CommandBar } from '../../../shared/components/commandBarV9';

describe('directMethod', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DirectMethod/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
