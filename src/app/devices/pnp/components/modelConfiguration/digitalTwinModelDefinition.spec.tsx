/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DigitalTwinModelDefinition } from './digitalTwinModelDefinition';
import { ResourceKeys } from '../../../../../localization/resourceKeys';
import { MultiLineShimmer } from '../../../../shared/components/multiLineShimmer';
import { pnpStateInitial, PnpStateInterface } from '../../state';
import * as pnpStateContext from '../../context/pnpStateContext';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

describe('DigitalTwinModelDefinition', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><DigitalTwinModelDefinition/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
