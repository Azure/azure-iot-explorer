/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DigitalTwinModelDefinition } from './digitalTwinModelDefinition';
import * as pnpStateContext from '../../context/pnpStateContext';
import { pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=test', hash: '', state: null, key: 'default' })
}));

describe('DigitalTwinModelDefinition', () => {
    it('shows failure heading when model definition payload is null', () => {
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                twin: { payload: { modelId: 'dtmi:test;1' }, synchronizationStatus: SynchronizationStatus.fetched },
                modelDefinitionWithSource: { payload: null, synchronizationStatus: SynchronizationStatus.fetched }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });

        render(<MemoryRouter><DigitalTwinModelDefinition/></MemoryRouter>);

        expect(screen.getByText(/digitalTwin\.steps\.secondFailure/)).toBeDefined();
    });

    it('shows success heading when model definition is available', () => {
        jest.spyOn(pnpStateContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                twin: { payload: { modelId: 'dtmi:test;1' }, synchronizationStatus: SynchronizationStatus.fetched },
                modelDefinitionWithSource: {
                    payload: {
                        modelDefinition: { '@id': 'dtmi:test;1', contents: [] },
                        isModelValid: true,
                        source: REPOSITORY_LOCATION_TYPE.Public
                    },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });

        render(<MemoryRouter><DigitalTwinModelDefinition/></MemoryRouter>);

        expect(screen.getByText('digitalTwin.steps.secondSuccess')).toBeDefined();
    });
});
