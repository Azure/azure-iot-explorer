/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { DeviceContentTypePanel } from './deviceContentTypePanel';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';


describe('DeviceDecoderPanel', () => {
    it('renders without crashing', () => {
        const { container } = render(<DeviceContentTypePanel/>);
        expect(container).toBeDefined();
    });
});
