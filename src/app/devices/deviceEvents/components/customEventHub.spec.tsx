/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CustomEventHub } from './customEventHub';

jest.mock('../context/deviceEventsStateContext', () => ({
    useDeviceEventsStateContext: () => [{
        events: [],
        formMode: 'idle'
    }, jest.fn()]
}));

describe('customEventHub', () => {
    it('renders without crashing', () => {
        const props = {
            monitoringData: false,
            useBuiltInEventHub: true,
            customEventHubConnectionString: '',
            setUseBuiltInEventHub: jest.fn(),
            setCustomEventHubConnectionString: jest.fn(),
            setHasError: jest.fn()
        };
        const { container } = render(<MemoryRouter><CustomEventHub {...props}/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
