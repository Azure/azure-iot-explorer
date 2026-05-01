/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ModuleIdentityList } from './moduleIdentityList';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { getModuleIdentitiesAction } from '../actions';
import { CommandBarV9 as CommandBar } from '../../../../shared/components/commandBarV9';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ pathname: '', search: '', hash: '', state: null, key: 'default' }),
    useNavigate: () => jest.fn(),

}));

describe('ModuleIdentityList', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.working
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(render(<MemoryRouter><ModuleIdentityList /></MemoryRouter>)).toBeDefined();
        });

        it('matches snapshot when fetch failed', () => {
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.failed
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(render(<MemoryRouter><ModuleIdentityList /></MemoryRouter>)).toBeDefined();
        });

        it('matches snapshot with moduleIdentityList', () => {
            const initialState = {
                payload: [{
                    authentication: null,
                    deviceId: 'testDevice',
                    moduleId: 'testModule'
                }],
                synchronizationStatus: SynchronizationStatus.working
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(render(<MemoryRouter><ModuleIdentityList /></MemoryRouter>)).toBeDefined();
        });

        it('calls refresh', () => {
            const getModuleIdentitiesActionSpy = jest.spyOn(getModuleIdentitiesAction, 'started');
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            const { container } = render(<MemoryRouter><ModuleIdentityList /></MemoryRouter>);
            expect(getModuleIdentitiesActionSpy).toBeCalled();
        });
    });
});