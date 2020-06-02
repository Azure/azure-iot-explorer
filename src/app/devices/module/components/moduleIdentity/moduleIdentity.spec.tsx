/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { shallow, mount } from 'enzyme';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ModuleIdentityComponent, ModuleIdentityDataProps, ModuleIdentityDispatchProps } from './moduleIdentity';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = `/`;

jest.mock('react-router-dom', () => ({
    useHistory: () => ({ push: jest.fn() }),
    useLocation: () => ({ search: '', pathname }),
    useRouteMatch: () => ({ url: pathname }),
}));

const moduleIdentityDataProps: ModuleIdentityDataProps = {
    moduleIdentityList: [],
    synchronizationStatus: SynchronizationStatus.working
};

const mockGetModuleIdentities = jest.fn();
const moduleIdentityDispatchProps: ModuleIdentityDispatchProps = {
    getModuleIdentities: mockGetModuleIdentities
};

const getComponent = (overrides = {}) => {
    const props = {
        ...moduleIdentityDataProps,
        ...moduleIdentityDispatchProps,
        ...overrides
    };
    return <ModuleIdentityComponent {...props} />;
};

describe('devices/components/moduleIdentity', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            expect(shallow(getComponent())).toMatchSnapshot();
        });

        it('matches snapshot when fetch failed', () => {
            expect(shallow(getComponent({
                synchronizationStatus: SynchronizationStatus.failed
            }))).toMatchSnapshot();
        });

        it('matches snapshot with moduleIdentityList', () => {
            expect(shallow(getComponent({
                moduleIdentityList: [{
                    authentication: null,
                    deviceId: 'testDevice',
                    moduleId: 'testModule'
                }],
                synchronizationStatus: SynchronizationStatus.fetched
            }))).toMatchSnapshot();
        });

        it('calls refresh', () => {
            const wrapper = mount(getComponent());
            const commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[1].onClick(null);
            expect(mockGetModuleIdentities).toBeCalled();
        });
    });
});
