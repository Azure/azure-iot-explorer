/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventsContent } from './eventsContent';
import { REPOSITORY_LOCATION_TYPE } from '../../../constants/repositoryLocationTypes';
import { ResourceKeys } from '../../../../localization/resourceKeys';
import { SynchronizationStatus } from '../../../api/models/synchronizationStatus';
import * as pnpStateContext from '../../pnp/context/pnpStateContext';
import { ErrorBoundary } from '../../shared/components/errorBoundary';
import { pnpStateInitial, PnpStateInterface } from '../../pnp/state';
import { testModelDefinition } from '../../pnp/components/deviceEvents/testData';
import * as deviceEventsStateContext from '../context/deviceEventsStateContext';
import { getInitialDeviceEventsState } from '../state';

describe('EventsContent', () => {
    it('renders without crashing', () => {
        const { container } = render(<MemoryRouter><EventsContent/></MemoryRouter>);
        expect(container).toBeDefined();
    });
});
