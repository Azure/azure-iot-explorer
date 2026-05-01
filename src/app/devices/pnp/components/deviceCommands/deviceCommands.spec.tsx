/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceCommands } from './deviceCommands';
import * as PnpContext from '../../context/pnpStateContext';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { pnpStateWithTestData } from './testData';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

describe('components/devices/deviceCommands', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceCommands/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
