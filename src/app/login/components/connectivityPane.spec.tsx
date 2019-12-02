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
        connectionStringList: ['testConnectionString'],
        rememberConnectionString: true
    };

    const mockSaveConnectionInfo = jest.fn();
    const connectivityPaneDispatchProps: ConnectivityPaneDispatchProps = {
        addNotification: jest.fn(),
        saveConnectionInfo: mockSaveConnectionInfo
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
        expect(mockSaveConnectionInfo).toBeCalledWith(
            {
                connectionString: 'testConnectionString',
                error: '',
                rememberConnectionString: true
            });
        expect(routerprops.history.push).toBeCalledWith('/devices');
    });

    it('changes state when connection string changes', () => {
        const wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onConnectionStringChangedFromTextField('newConnectionString1');
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('newConnectionString1');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onConnectionStringChangedFromDropdown(null, {key: 'newConnectionString2'} as any); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('newConnectionString2');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onCheckboxChange(null, false);
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).rememberConnectionString).toEqual(false);
    });
});
