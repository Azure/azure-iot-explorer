/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceProperties } from './deviceProperties';
import { InterfaceNotFoundMessageBar } from '../../../shared/components/interfaceNotFoundMessageBar';
import { TwinWithSchema } from './dataHelper';
import { PnpStateInterface, pnpStateInitial } from '../../state';
import * as PnpContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { testModelDefinition, testTwin } from './testData';
import { ModelDefinition } from '../../../../api/models/modelDefinition';
import { getDeviceTwinAction } from '../../actions';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

describe('components/devices/deviceProperties', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceProperties/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
