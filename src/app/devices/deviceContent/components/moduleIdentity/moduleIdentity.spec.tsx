/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as React from 'react';
import 'jest';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import ModuleIdentityComponent, { ModuleIdentityDataProps, ModuleIdentityDispatchProps } from './moduleIdentity';
import { mountWithLocalization, testWithLocalizationContext, testSnapshot } from '../../../../shared/utils/testHelpers';
import { SynchronizationStatus } from '../../../../api/models/synchronizationStatus';

const pathname = `/`;

const location: any = { // tslint:disable-line:no-any
    pathname
};
const routerprops: any = { // tslint:disable-line:no-any
    history: {
        location
    },
    location,
    match: {}
};

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
        ...routerprops,
        ...overrides
    };
    return <ModuleIdentityComponent {...props} />;
};

describe('devices/components/moduleIdentity', () => {
    context('snapshot', () => {
        it('matches snapshot while loading', () => {
            testSnapshot(getComponent());
        });

        it('matches snapshot when fetch failed', () => {
            testSnapshot(getComponent({
                synchronizationStatus: SynchronizationStatus.failed
            }));
        });

        it('matches snapshot with moduleIdentityList', () => {
            testSnapshot(getComponent({
                moduleIdentityList: [{
                    authentication: null,
                    deviceId: 'testDevice',
                    moduleId: 'testModule'
                }],
                synchronizationStatus: SynchronizationStatus.fetched
            }));
        });

        it('calls refresh', () => {
            const wrapper = mountWithLocalization(getComponent());
            const commandBar = wrapper.find(CommandBar).first();
            commandBar.props().items[0].onClick(null);
            expect(mockGetModuleIdentities).toBeCalled();
        });
    });
});
