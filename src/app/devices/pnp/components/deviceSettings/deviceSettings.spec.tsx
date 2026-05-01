/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceSettings } from './deviceSettings';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateWithTestData } from './testData';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

describe('deviceSettings', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceSettings/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
