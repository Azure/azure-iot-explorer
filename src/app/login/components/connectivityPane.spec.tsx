/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import 'jest';
import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { testSnapshot, mountWithLocalization } from '../../shared/utils/testHelpers';
import ConnectivityPane, { ConnectivityPaneDataProps, ConnectivityPaneDispatchProps } from './connectivityPane';

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
});
