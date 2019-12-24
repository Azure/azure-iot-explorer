/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { testSnapshot, mountWithLocalization } from '../../shared/utils/testHelpers';
import ConnectivityPane, { ConnectivityPaneDataProps, ConnectivityPaneDispatchProps, ConnectivityState } from './connectivityPane';
import HubConnectionStringSection from './hubConnectionStringSection';

describe('login/components/connectivityPane', () => {
    const routerprops: any = { // tslint:disable-line:no-any
        history: {
            location,
            push: jest.fn()
        },
        location,
    };

    const connectivityPaneDataProps: ConnectivityPaneDataProps = {
        connectionString: 'testConnectionString',
        connectionStringList: ['testConnectionString']
    };

    const mockSetActiveAzureResource = jest.fn();
    const connectivityPaneDispatchProps: ConnectivityPaneDispatchProps = {
        addNotification: jest.fn(),
        setActiveAzureResource: mockSetActiveAzureResource
    };

    const getComponent = (overrides = {}) => {
        const props = {
            ...connectivityPaneDataProps,
            ...connectivityPaneDispatchProps,
            ...routerprops,
            ...overrides
        };

        return (
            <ConnectivityPane {...props} />
        );
    };

    it('matches snapshot', () => {
        testSnapshot(getComponent());
    });

    it('calls saveConnectionInfo on button click', () => {
        const wrapper = mountWithLocalization(getComponent());
        const button = wrapper.find(PrimaryButton);
        button.props().onClick(null);
        expect(mockSetActiveAzureResource).toBeCalledWith(
            {
                connectionString: 'testConnectionString',
                connectionStringList: ['testConnectionString'],
                hostName: undefined
            });
        expect(routerprops.history.push).toBeCalledWith('resources/undefined/devices');
    });

    it('changes state when connection string changes', () => {
        const wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('testConnectionString');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onSaveConnectionString('newConnectionString2', ['newConnnectionString1', 'newConnectionString2'], ''); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('newConnectionString2');
        expect((wrapper.state() as ConnectivityState).connectionStringList).toEqual(['newConnnectionString1', 'newConnectionString2']);
    });
});
