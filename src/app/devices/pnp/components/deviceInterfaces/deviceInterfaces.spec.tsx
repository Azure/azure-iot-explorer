/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviceInterfaces } from './deviceInterfaces';
import * as PnpContext from '../../context/pnpStateContext';
import { pnpStateInitial } from '../../state';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import { REPOSITORY_LOCATION_TYPE } from '../../../../constants/repositoryLocationTypes';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '', search: '?deviceId=test&interfaceId=dtmi:test:Interface;1', hash: '', state: null, key: 'default' })
}));

describe('deviceInterfaces', () => {
    it('renders refresh and close buttons', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                modelDefinitionWithSource: {
                    payload: {
                        modelDefinition: { '@id': 'dtmi:test:Interface;1', displayName: 'TestInterface', description: 'Test desc' },
                        isModelValid: true,
                        source: REPOSITORY_LOCATION_TYPE.Public
                    },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });

        render(<MemoryRouter><DeviceInterfaces/></MemoryRouter>);

        // Note: refresh button name uses deviceProperties key (see source line 133)
        expect(screen.getByText('deviceProperties.command.refresh')).toBeDefined();
        expect(screen.getByText('deviceInterfaces.command.close')).toBeDefined();
    });

    it('renders interface ID field when model is valid', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                modelDefinitionWithSource: {
                    payload: {
                        modelDefinition: { '@id': 'dtmi:test:Interface;1', displayName: 'TestInterface', description: 'Test desc' },
                        isModelValid: true,
                        source: REPOSITORY_LOCATION_TYPE.Public
                    },
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });

        render(<MemoryRouter><DeviceInterfaces/></MemoryRouter>);

        expect(screen.getByLabelText('deviceInterfaces.columns.id')).toBeDefined();
    });

    it('shows not found message when payload is null', () => {
        jest.spyOn(PnpContext, 'usePnpStateContext').mockReturnValue({
            pnpState: pnpStateInitial().merge({
                modelDefinitionWithSource: {
                    payload: null,
                    synchronizationStatus: SynchronizationStatus.fetched
                }
            }),
            dispatch: jest.fn(),
            getModelDefinition: jest.fn()
        });

        render(<MemoryRouter><DeviceInterfaces/></MemoryRouter>);

        expect(screen.getByText('deviceInterfaces.interfaceNotFound')).toBeDefined();
    });
});
