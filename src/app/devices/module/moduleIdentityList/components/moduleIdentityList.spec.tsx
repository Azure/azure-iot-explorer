/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ModuleIdentityList } from './moduleIdentityList';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';
import * as AsyncSagaReducer from '../../../../shared/hooks/useAsyncSagaReducer';
import { getModuleIdentitiesAction } from '../actions';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '', pathname }),
    useRouteMatch: () => ({ url: pathname }),
}));

describe('ModuleIdentityList', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.working
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityList/>)).toMatchSnapshot();
        });

        it('matches snapshot when fetch failed', () => {
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.failed
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            expect(shallow(<ModuleIdentityList/>)).toMatchSnapshot();
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
            expect(shallow(<ModuleIdentityList/>)).toMatchSnapshot();
        });

        it('calls refresh', () => {
            const getModuleIdentitiesActionSpy = jest.spyOn(getModuleIdentitiesAction, 'started');
            const initialState = {
                payload: [],
                synchronizationStatus: SynchronizationStatus.fetched
            };
            jest.spyOn(AsyncSagaReducer, 'useAsyncSagaReducer').mockReturnValueOnce([initialState, jest.fn()]);
            const wrapper = mount(<ModuleIdentityList/>);
            const commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[1].onClick(null);
            expect(getModuleIdentitiesActionSpy).toBeCalled();
        });
    });
});
