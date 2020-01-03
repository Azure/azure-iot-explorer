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
import * as HubConnectionStringHelper from '../../shared/utils/hubConnectionStringHelper';

describe('login/components/connectivityPane', () => {
    const spy = jest.spyOn(HubConnectionStringHelper, 'generateConnectionStringValidationError');
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
    const mockSetConnectionStrings = jest.fn();
    const connectivityPaneDispatchProps: ConnectivityPaneDispatchProps = {
        addNotification: jest.fn(),
        setActiveAzureResource: mockSetActiveAzureResource,
        setConnectionStrings: mockSetConnectionStrings
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
                hostName: undefined
            });

        expect(mockSetConnectionStrings).toBeCalledWith(['testConnectionString']);
        expect(routerprops.history.push).toBeCalledWith('resources/undefined/devices');
    });

    it('changes state when connection string changes (not amending invalid connection string)', () => {
        const wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('testConnectionString');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onChangeConnectionString('newConnectionString2', true); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('newConnectionString2');
        expect((wrapper.state() as ConnectivityState).connectionStringList).toEqual(['testConnectionString']);
    });

    it('changes state when connection string changes (amending valid connection string)', () => {
        spy.mockReturnValue('');

        const wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('testConnectionString');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onChangeConnectionString('newConnectionString2', true); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('newConnectionString2');
        expect((wrapper.state() as ConnectivityState).connectionStringList).toEqual(['newConnectionString2', 'testConnectionString']);
    });

    it('changes state when connection string removed', () => {
        const wrapper = mountWithLocalization(getComponent());
        let hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('testConnectionString');

        hubConnectionStringSection = wrapper.find(HubConnectionStringSection);
        hubConnectionStringSection.props().onRemoveConnectionString('testConnectionString'); // tslint:disable-line:no-any
        wrapper.update();
        expect((wrapper.state() as ConnectivityState).connectionString).toEqual('');
        expect((wrapper.state() as ConnectivityState).connectionStringList).toEqual([]);
    });
});
