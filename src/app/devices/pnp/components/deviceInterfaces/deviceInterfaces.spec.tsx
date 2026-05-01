/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceInterfaces } from './deviceInterfaces';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as PnpContext from '../../context/pnpStateContext';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

describe('deviceInterfaces', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DeviceInterfaces/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
